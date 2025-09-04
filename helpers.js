import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase-config";

export async function getCarCheckResults(carNumber) {
  // Helper to fetch one doc from a collection by carNumber
  const fetchOne = async (colName) => {
    const q = query(
      collection(db, colName),
      where("car_Number", "==", carNumber)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data();
    }
    return null;
  };

  const [details, roadWorth, insurance] = await Promise.all([
    fetchOne("CarDetails"),
    fetchOne("RoadWorth"),
    fetchOne("Insurance"),
  ]);

  return { details, roadWorth, insurance };
}

export async function getLicenseDetails(licenseNumber) {
  const q = query(
    collection(db, "License"),
    where("license_Num", "==", licenseNumber)
  );
  const snap = await getDocs(q);

  if (!snap.empty) {
    return snap.docs[0].data(); // get first match
  } else {
    return null;
  }
}

export async function getOfficerData(officerEmail) {
  const q = query(
    collection(db, "Officers"),
    where("officer_email", "==", officerEmail)
  );
  const snap = await getDocs(q);

  if (!snap.empty) {
    return snap.docs[0].data(); // get first match
  } else {
    return null;
  }
}