import moviePojo from "../models/movies/moviePojo.js";
import actorPojo from "../models/actors/actorPojo.js";
import messageapp from "../data/messages.js";

import { ManagerMongoDB } from "./../managers/manager-mongodb.js";

let mongo = new ManagerMongoDB("movies");
let mongoA = new ManagerMongoDB("actors");

class MoviesModel {
  async getMovies() {
    console.log("---> moviesModel::getMovies");
    const movies = await mongo.getMovies();
    return movies;
  }

  async getMovieById(id) {
    console.log(`---> moviesModel::getMovieById = ${id}`);

    const _movie = await mongo.getMovieByID(id);
    if (typeof _movie == "undefined")
      throw new Error(messageapp.movie_dosent_exist);
    return _movie;
  }

  async removeMovie(id) {
    console.log(`---> moviesModel::removeMovie = ${id}`);
    const index = await mongo.removeMovie(id);

    return index;
  }

  getMovieBy(elem) {
    console.log(`---> moviesModel::getMovieBy = ${elem.value}`);

    const _movies = movie.getMovieBy(elem);

    _movies.forEach((element) => {
      element.actors = actor.getActorsById(element.id).actors;
    });
    return _movies;
  }

  async createMovie(req) {
    console.log(`---> moviesModel::createMovie = ${req.id}`);

    const new_movie = moviePojo(req);
    if (typeof new_movie == "undefined")
      throw new Error(messageapp.parameter_not_especified);

    const new_actor = actorPojo(req);
    if (typeof new_actor == "undefined")
      throw new Error(messageapp.parameter_not_especified);

    await mongo.createMovie(new_movie);
    await mongoA.createActors(new_actor);
  }

  async updateMovie(req) {
    console.log(`---> moviesModel::updateMovie = ${req.id}`);

    const new_movie = moviePojo(req);
    if (typeof new_movie == "undefined")
      throw new Error(messageapp.parameter_not_especified);

    const new_actor = actorPojo(req);
    if (typeof new_actor == "undefined")
      throw new Error(messageapp.parameter_not_especified);

    await mongo.updateMovie(new_movie);
    await mongoA.updateActors(new_actor);
  }

  getMoviesFromActor(req) {
    console.log(`---> moviesModel::getMoviesFromActor = ${req.value}`);

    let _movies = [];

    const movies_id = actor.getIDFromActor(req);
    movies_id.forEach((element) => {
      _movies.push(movie.getMovieById(element.id));
    });

    return _movies;
  }

  addActors(req) {
    console.log(`---> moviesModel::addActors = ${req.id}`);

    actor.addActorToMovie(req);
    return this.getMovieById(req.id);
  }
}

export default new MoviesModel();
