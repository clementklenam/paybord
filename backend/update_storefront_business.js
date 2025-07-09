const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://admin2:Admin1234@cluster0.nj0wmq4.mongodb.net/test";
const client = new MongoClient(uri);

const STOREFRONT_ID = "6859be4fe8ea07ed4f4e393b"; // <-- Replace with your storefront's _id
const NEW_BUSINESS_ID = "6844a2af794c9a87e4c336be"; // <-- The correct businessId for your dashboard

async function run() {
  try {
    await client.connect();
    const db = client.db('test');
    const storefronts = db.collection('storefronts');

    const result = await storefronts.updateOne(
      { _id: new ObjectId(STOREFRONT_ID) },
      { $set: { business: new ObjectId(NEW_BUSINESS_ID) } }
    );

    if (result.modifiedCount === 1) {
      console.log("SUCCESS: Storefront business updated!");
    } else {
      console.log("No storefront updated. Check your IDs.");
    }
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await client.close();
  }
}

run();
