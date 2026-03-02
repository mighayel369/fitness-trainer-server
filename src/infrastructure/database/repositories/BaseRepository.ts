import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
} from "mongoose";

export abstract class BaseRepository<
  TDocument extends Document,
  TEntity
> {
  protected abstract model: Model<TDocument>;
  protected abstract toEntity(doc: TDocument): TEntity;

  protected mapMany(docs: TDocument[] = []): TEntity[] {
    return docs.map((d) => this.toEntity(d));
  }
async create(
  data: Partial<TDocument>
): Promise<TEntity | null> {
  const doc = await this.model.create(data);
  return doc ? this.toEntity(doc) : null;
}
  async findMany(
    filter: FilterQuery<TDocument> = {},
    page = 1,
    limit = 10,
  ): Promise<{ data: TEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const query = this.model.find(filter);

    const totalCount = await this.model.countDocuments(filter);
    const docs = await query.limit(limit).skip(skip).exec();

    return {
      data: this.mapMany(docs),
      totalCount
    };
  }

  async findOne(
    filter: FilterQuery<TDocument>
  ): Promise<TEntity | null> {
    const query = this.model.findOne(filter);

    const doc = await query.exec();
    return doc ? this.toEntity(doc) : null;
  }

  async update(
    id: string,
    data: UpdateQuery<TDocument>
  ): Promise<TEntity | null> {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const doc = await this.model.findByIdAndDelete(id);
    return !!doc;
  }
  async aggregateMany(
    match: FilterQuery<TDocument>,
    page: number = 1,
    limit: number = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 },
    lookup?: { from: string; localField: string; foreignField: string; as: string }
  ): Promise<{ data: TEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const pipeline: any[] = [{ $match: match }];

    if (lookup) {
      pipeline.push(
        {
          $lookup: {
            from: lookup.from,
            localField: lookup.localField,
            foreignField: lookup.foreignField,
            as: lookup.as,
          },
        },
        {
          $addFields: {
            [lookup.localField]: `$${lookup.as}`,
          },
        },
        { $project: { [lookup.as]: 0 } }
      );
    }

    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        docs: [{ $sort: sort }, { $skip: skip }, { $limit: limit }],
      },
    });

    const result = await this.model.aggregate(pipeline);

    const totalCount = result[0].metadata[0]?.total || 0;
    const data = (result[0].docs || []).map((doc: any) => this.toEntity(doc));

    return { data, totalCount };
  }
  
  async aggregateOne(
  match: FilterQuery<TDocument>,
  lookup?: { from: string; localField: string; foreignField: string; as: string }
): Promise<TEntity | null> {
  const pipeline: any[] = [{ $match: match }];

  if (lookup) {
    pipeline.push(
      {
        $lookup: {
          from: lookup.from,
          localField: lookup.localField,
          foreignField: lookup.foreignField,
          as: lookup.as,
        },
      },
      { $addFields: { [lookup.localField]: `$${lookup.as}` } },
      { $project: { [lookup.as]: 0 } }
    );
  }

  const result = await this.model.aggregate(pipeline);
  return result.length > 0 ? this.toEntity(result[0]) : null;
}
}

