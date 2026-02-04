export async function fetchEquipments() {
  const res = await fetch("http://localhost:3000/equipment");
  if (!res.ok) {
    throw new Error("Failed to fetch equipments");
  }
  return res.json();
}