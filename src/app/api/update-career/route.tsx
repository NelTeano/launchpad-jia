import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    let requestData = await request.json();
    const { _id, ...careerData } = requestData;

    const { db } = await connectMongoDB();

    // Check if this is an update or create operation
    if (_id) {
      // UPDATE existing career
      console.log("Updating existing career with _id:", _id);
      
      const result = await db
        .collection("careers")
        .updateOne(
          { _id: new ObjectId(_id) }, 
          { 
            $set: {
              ...careerData,
              updatedAt: new Date().toISOString()
            }
          }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: "Career not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Career updated successfully",
        career: { 
          _id, 
          ...careerData 
        },
      });
    } else {
      // CREATE new career
      console.log("Creating new career");
      
      const newCareer = {
        ...careerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };

      const result = await db
        .collection("careers")
        .insertOne(newCareer);

      return NextResponse.json({
        message: "Career created successfully",
        career: { 
          _id: result.insertedId.toString(),
          ...newCareer 
        },
      });
    }
  } catch (error) {
    console.error("Error managing career:", error);
    return NextResponse.json(
      { error: "Failed to manage career", details: error.message },
      { status: 500 }
    );
  }
}