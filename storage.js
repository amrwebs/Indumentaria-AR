// storage.js — IndexedDB nativo (sin dependencias), con fallback a memoria y/o Firestore opcional
(function () {
  const useFirebase = !!(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId);

  // ---------- IndexedDB nativo (una DB, 4 objectStores) ----------
  const DB_NAME = 'indumentaria_ar';
  const DB_VERSION = 1;
  const STORES = ['productos', 'categorias', 'ventas', 'negocio'];

  function openDB() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB no disponible'));
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        STORES.forEach((s) => {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Error abriendo IDB'));
    });
  }

  // ✅ Corregido: ahora propaga el valor devuelto por fn(store)
  async function withStore(storeName, mode, fn) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);

      let out; // guardamos el resultado de fn(store)
      Promise.resolve(fn(store))
        .then((v) => { out = v; })
        .catch((err) => { reject(err); tx.abort(); });

      tx.oncomplete = () => resolve(out);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Transacción abortada'));
    });
  }

  const idbAPI = {
    async get(store, key) {
      return withStore(store, 'readonly', (os) => new Promise((res, rej) => {
        const r = os.get(key);
        r.onsuccess = () => res(r.result ?? null);
        r.onerror = () => rej(r.error);
      }));
    },
    async set(store, key, val) {
      return withStore(store, 'readwrite', (os) => new Promise((res, rej) => {
        const r = os.put(val, key);
        r.onsuccess = () => res(true);
        r.onerror = () => rej(r.error);
      }));
    },
    async del(store, key) {
      return withStore(store, 'readwrite', (os) => new Promise((res, rej) => {
        const r = os.delete(key);
        r.onsuccess = () => res(true);
        r.onerror = () => rej(r.error);
      }));
    },
    async keys(store) {
      return withStore(store, 'readonly', (os) => new Promise((res, rej) => {
        const out = [];
        const r = os.openKeyCursor(); // compatible incluso bajo file://
        r.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) { out.push(String(cursor.key)); cursor.continue(); }
          else res(out);
        };
        r.onerror = () => rej(r.error);
      }));
    }
  };

  // ---------- Fallback memoria ----------
  const mem = new Map();
  const memAPI = {
    async get(s, k) { return mem.get(`${s}:${k}`) ?? null; },
    async set(s, k, v) { mem.set(`${s}:${k}`, v); return true; },
    async del(s, k) { mem.delete(`${s}:${k}`); return true; },
    async keys(s) { return [...mem.keys()].filter(k => k.startsWith(s+':')).map(k => k.split(':')[1]); }
  };

  // ---------- Firestore (opcional) ----------
  let fs = null;
  function initFirestore() {
    const app = firebase.initializeApp(window.FIREBASE_CONFIG);
    fs = firebase.firestore(app);
    fs.enablePersistence?.({ synchronizeTabs: true }).catch(() => {});
  }

  // ---------- Utils ----------
  const genId = () => Math.random().toString(36).slice(2,10) + Date.now().toString(36);

  // ---------- API pública ----------
  const Store = {
    engine: 'indexed',  // intentamos IDB por defecto; si falla cambiamos a memory o firestore
    _kv: idbAPI,

    async init() {
      if (useFirebase) {
        initFirestore();
        this.engine = 'firestore';
      } else {
        try {
          await openDB();           // abre/crea DB y stores
          this.engine = 'indexed';
          this._kv = idbAPI;
        } catch (e) {
          console.warn('IndexedDB no disponible, usando memoria. Motivo:', e);
          this.engine = 'memory';
          this._kv = memAPI;
        }
      }

      // Doc por defecto de negocio
      try {
        const negocio = await this.getDoc('negocio', 'datos');
        if (!negocio) {
          await this.setDoc('negocio', 'datos', { nombre: 'INDUMENTARIA R', cuit:'', dir:'', ciudad:'', tel:'' });
        }
      } catch (e) {
        console.error('Error init negocio:', e);
      }
    },

    // -------- Productos
    async listProductos(query = {}) {
      if (useFirebase && this.engine === 'firestore') {
        let q = fs.collection('productos');
        if (query.categoriaId) q = q.where('categoriaId','==',query.categoriaId);
        const snap = await q.get();
        const base = snap.docs.map(d=>({id:d.id, ...d.data()}));
        if (!query.texto) return base;
        const t = query.texto.toLowerCase();
        return base.filter(p =>
          (p.sku||'').toLowerCase().includes(t) ||
          (p.nombre||'').toLowerCase().includes(t) ||
          (p.color||'').toLowerCase().includes(t)
        );
      } else {
        const keys = await this._kv.keys('productos');         // ← ahora siempre es Array
        const items = await Promise.all(keys.map(k => this._kv.get('productos', k)));
        const arr = items.filter(Boolean);
        return arr.filter(p => {
          if (query.categoriaId && p.categoriaId !== query.categoriaId) return false;
          if (query.texto) {
            const t = query.texto.toLowerCase();
            return (p.sku||'').toLowerCase().includes(t) ||
                   (p.nombre||'').toLowerCase().includes(t) ||
                   (p.color||'').toLowerCase().includes(t);
          }
          return true;
        });
      }
    },
    async getProductoBySKU(sku){
      const all = await this.listProductos();
      const s = (sku||'').toLowerCase();
      return all.find(p => (p.sku||'').toLowerCase() === s) || null;
    },
    async saveProducto(p){
      if (!p.id) p.id = genId();
      if (useFirebase && this.engine === 'firestore') {
        await fs.collection('productos').doc(p.id).set(p);
      } else {
        await this._kv.set('productos', p.id, p);
      }
      return p;
    },
    async deleteProducto(id){
      if (useFirebase && this.engine === 'firestore') {
        await fs.collection('productos').doc(id).delete();
      } else {
        await this._kv.del('productos', id);
      }
    },

    // -------- Categorías
    async listCategorias(){
      if (useFirebase && this.engine === 'firestore') {
        const snap = await fs.collection('categorias').get();
        return snap.docs.map(d=>({id:d.id, ...d.data()}));
      } else {
        const keys = await this._kv.keys('categorias');
        const items = await Promise.all(keys.map(k => this._kv.get('categorias', k)));
        return items.filter(Boolean);
      }
    },
    async saveCategoria(c){
      if (!c.id) c.id = genId();
      if (useFirebase && this.engine === 'firestore') {
        await fs.collection('categorias').doc(c.id).set(c);
      } else {
        await this._kv.set('categorias', c.id, c);
      }
      return c;
    },
    async deleteCategoria(id){
      if (useFirebase && this.engine === 'firestore') {
        await fs.collection('categorias').doc(id).delete();
      } else {
        await this._kv.del('categorias', id);
      }
    },

    // -------- Ventas
    async listVentas(){
      if (useFirebase && this.engine === 'firestore') {
        const snap = await fs.collection('ventas').orderBy('fechaISO','desc').get();
        return snap.docs.map(d=>({id:d.id, ...d.data()}));
      } else {
        const keys = await this._kv.keys('ventas');
        const items = await Promise.all(keys.map(k => this._kv.get('ventas', k)));
        return items
          .filter(Boolean)
          .sort((a,b)=>String(b.fechaISO||'').localeCompare(String(a.fechaISO||'')));
      }
    },
    async saveVenta(v){
      if (!v.id) v.id = genId();
      if (useFirebase && this.engine === 'firestore') {
        await fs.collection('ventas').doc(v.id).set(v);
      } else {
        await this._kv.set('ventas', v.id, v);
      }
      return v;
    },

    // -------- Docs simples (negocio/datos)
    async getDoc(collection, id){
      if (useFirebase && this.engine === 'firestore') {
        const d = await fs.collection(collection).doc(id).get();
        return d.exists ? {id:d.id, ...d.data()} : null;
      } else {
        return await this._kv.get(collection, id);
      }
    },
    async setDoc(collection, id, data){
      if (useFirebase && this.engine === 'firestore') {
        await fs.collection(collection).doc(id).set(data);
      } else {
        await this._kv.set(collection, id, data);
      }
    }
  };

  window.Store = Store;
})();
