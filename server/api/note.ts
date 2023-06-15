export default defineEventHandler((event) => {
  window.indexedDB.open("MyTestDatabase", 3);

  return {
    hello: 'world'
  }

})