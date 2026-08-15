/* Mapealo · service worker
   Hoy sirve para dos cosas:
     1. mostrar el aviso de "manual listo" aunque la app no esté delante
     2. que al tocar el aviso se abra la app en la pantalla del manual

   Lo que AÚN NO hace y hace falta backend para ello: recibir un push del
   servidor con la app cerrada del todo (Web Push + claves VAPID). El hueco
   está marcado abajo a propósito. */

self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

/* al tocar el aviso, traer al frente la app */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({type: "window", includeUncontrolled: true}).then(ls => {
      for (const c of ls) if ("focus" in c) return c.focus();
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});

/* PENDIENTE (necesita servidor): cuando exista backend, el servidor manda un
   push al terminar de generar el manual y esto lo enseña con la app cerrada.
self.addEventListener("push", e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification("Ya está tu manual", {
    body: (d.titulo || "El manual") + " está listo.", tag: "mapealo-listo"
  }));
});
*/
