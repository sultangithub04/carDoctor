import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const DELETE = async (req, { params }) => {
    const bookingCollection = dbConnect(collectionNamesObj.bookingCollection)
    const p = await params;
    const query = { _id: new ObjectId(p.id) }
    // validatation
    const session = await getServerSession(authOptions)
    const currentBooking = await bookingCollection.findOne(query)
    const isOwnerOk = session?.user?.email == currentBooking?.email
    if (isOwnerOk) {
        // deleting user specific booking
        const deleteResponse = await bookingCollection.deleteOne(query)
        return NextResponse.json(deleteResponse);
    } else {
        return NextResponse.json({ success: false, message: "forbidden action" }, {status:401})
    }

}

export const GET = async (req, { params }) => {
    const p = await params;
    const servicesCollection = dbConnect(collectionNamesObj.servicesCollection)
    const data = await servicesCollection.findOne({ _id: new ObjectId(p.id) })
    return NextResponse.json(data);
}