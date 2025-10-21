function generateUniqueId() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString().slice(2, 8);
  const uniqueId = timestamp + random;
  return uniqueId.slice(0, 16);
}

module.exports = generateUniqueId;