window.Masar = window.Masar || {};
Masar.Storage = {
  get(key, fallback=null){
    try { return localStorage.getItem(key) ?? fallback; } catch(e){ return fallback; }
  },
  set(key, value){
    try { localStorage.setItem(key, value); } catch(e){}
  }
};
