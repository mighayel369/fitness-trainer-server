import { Model, Document, FilterQuery, UpdateQuery, ProjectionType } from "mongoose";

export abstract class BaseRepository<TDocument extends Document,TEntity> {
  protected abstract model: Model<TDocument>;
  protected abstract toEntity(doc: TDocument): TEntity;

  protected mapMany(docs: TDocument[] = []): TEntity[] {
    return docs.map((d) => this.toEntity(d));
  }

  async create(payload: Partial<TDocument>): Promise<TEntity> {
    const doc = await this.model.create(payload);
    return this.toEntity(doc);
  }

  async findById(
    id: string,
    projection?: ProjectionType<TDocument>
  ): Promise<TEntity | null> {
    const doc = await this.model.findById(id, projection);
    return doc ? this.toEntity(doc) : null;
  }

  async findOne(
    filter: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>
  ): Promise<TEntity | null> {
    const doc = await this.model.findOne(filter, projection);
    return doc ? this.toEntity(doc) : null;
  }

  async findMany(
    filter: FilterQuery<TDocument> = {},
    limit = 10,
    skip = 0,
    projection?: ProjectionType<TDocument>
  ): Promise<TEntity[]> {
    const docs = await this.model.find(filter, projection).limit(limit).skip(skip);
    return this.mapMany(docs);
  }

  async count(filter: FilterQuery<TDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter);
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
}
