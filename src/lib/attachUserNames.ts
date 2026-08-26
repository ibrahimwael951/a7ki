import mongoose from "mongoose";

export async function getUserNameMap(
  userIds: string[],
): Promise<Map<string, string>> {
  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));

  if (uniqueIds.length === 0) {
    return new Map();
  }

  if (!mongoose.connection.db) {
    throw new Error("MongoDB is not connected");
  }

  const users = await mongoose.connection.db
    .collection("user")
    .aggregate([
      {
        $addFields: {
          _idStr: { $toString: "$_id" },
        },
      },
      {
        $match: {
          _idStr: { $in: uniqueIds },
        },
      },
      {
        $project: {
          _idStr: 1,
          name: 1,
        },
      },
    ])
    .toArray();

  return new Map(
    users.map((u: any) => [u._idStr, u.name as string])
  );
}