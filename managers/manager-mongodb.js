import mongodb from "mongodb";

const uri =
  "mongodb+srv://manuel:mongodb@cluster0.yb9ou.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "media";
const client = new mongodb.MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

export class ManagerMongoDB {
  constructor(_collection) {
    this.collection = _collection;
  }

  async getMovies() {
    let findResult = [];
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
      const col = client.db(dbName).collection(this.collection);
      findResult = await col
        .aggregate([
          {
            $lookup: {
              from: "actors",
              localField: "id",
              foreignField: "id",
              as: "actors",
            },
          },
          { $unwind: "$actors" },
          {
            $project: {
              id: 1,
              title: 1,
              genres: 1,
              year: 1,
              director: 1,
              "actors.actors": 1,
            },
          },
        ])
        .toArray();
      return findResult;
    } catch (e) {
      console.log(e);
    } finally {
      client.close();
      console.log("Connection closed");
    }
  }

  async getMovieByID(_id) {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
      const col = client.db(dbName).collection(this.collection);
      let findResult = await col
        .aggregate([
          { $match : {id: parseInt(_id)} },
          {
            $lookup: {
              from: "actors",
              localField: "id",
              foreignField: "id",
              as: "actors",
            },
          },
          { $unwind: "$actors" },
          {
            $project: {
              id: 1,
              title: 1,
              genres: 1,
              year: 1,
              director: 1,
              "actors.actors": 1,
            },
          },
        ])
        .toArray();
      console.log(findResult);
      return findResult;
    } catch (e) {
      console.log(e);
    } finally {
      client.close();
      console.log("Connection closed");
    }
  }

  async removeMovie(_id) {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
      const col = client.db(dbName).collection(this.collection);
      const result = await col.deleteOne({ id: parseInt(_id) });
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
        await this.removeActors(_id);
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
      return result.deletedCount;
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
      console.log("Connection closed");
    }
  }

  async removeActors(_id){
    const col = client.db(dbName).collection('actors');
    await col.deleteOne({ id: parseInt(_id) });
  }

  async updateMovie(new_movie) {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
      const col = client.db(dbName).collection(this.collection);
      await col.updateOne(
        { id: parseInt(new_movie.id) },
        {
          $set: {
            id: new_movie.id,
            title: new_movie.title,
            genres: new_movie.genres,
            year: new_movie.year,
            director: new_movie.director,
          },
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
    }
  }

  async updateActors(new_actor) {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
      const col = client.db(dbName).collection(this.collection);
      await col.updateOne(
        { id: parseInt(new_actor.id) },
        {
          $set: {
            id: new_actor.id,
            actors: new_actor.actors,
          },
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
      client.close();
      console.log("Connection closed");
    }
  }

  async createMovie(new_movie) {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
      const col = client.db(dbName).collection(this.collection);
      //await col.insertOne(new_movie);
      await col.updateOne({id:new_movie.id},{$set: new_movie},{upsert:true});
    } catch (e) {
      console.log(e);
    } finally {
      client.close();
      console.log("Connection closed");
    }
  }

  async createActors(new_actor) {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
      const col = client.db(dbName).collection(this.collection);
      //await col.insertOne(new_actor);
      await col.updateOne({id:new_actor.id},{$set: new_actor},{upsert:true});
    } catch (e) {
      console.log(e);
    } finally {
      client.close();
      console.log("Connection closed");
    }
  }

  async getActorsByID(_id) {
    try {
      await client.connect();
      const act = client.db(dbName).collection("actors");
      const findResult = act.findOne({ id: parseInt(_id) });
      console.log(findResult);
      return findResult.actors;
    } catch (e) {
      console.log(e);
    } finally {
      client.close();
      console.log("Connection closed");
    }
  }

  async createUser(user){
    try {
      await client.connect();
      const usr = client.db(dbName).collection(this.collection);
      await usr.insertOne(user);
      return usr.findOne({username: user.username});
    } catch (e) {
      console.log(e);
    } finally {
      // client.close();
      // console.log("Connection closed");
    }
  }

  async loginUser(user){
    try {
      await client.connect();
      const usr = client.db(dbName).collection(this.collection);
      return usr.findOne({username: user.username});
    } catch (e) {
      console.log(e);
    } finally {
    //   client.close();
    //   console.log("Connection closed");
    }
  }

}
