const AsyncRouter = require("express-async-router").AsyncRouter;
const _ = require('lodash');
const router = AsyncRouter();

module.exports = function(){

  /*Покемоны без сортировки по метрике (но по имени)
  */
  router.get("/",async function (req, res) {
		let {query, params, data} = req;
		let ret;
		let sorting = [...data];

		let sort = _.orderBy(sorting, ['name'], ['asc']);

		return await res.json(limit(sort.map((pokemon)=>pokemon.name), query));
	});

  /*fat - max(pokemon.weight / pokemon.height)
  */
	router.get("/fat", async function (req, res) {

		let {query, params, data} = req;
		let ret;
		let sorting = [...data];

		let sort = _.orderBy(sorting, [(item) => {
			return item.weight/item.height;
		}, 'name'], ['desc', 'asc']);


		return await res.json(limit(sort.map((pokemon)=>pokemon.name), query));
	});

  /*angular - min(pokemon.weight / pokemon.height)
  */
	router.get("/angular", async function (req, res) {
		let {query, params, data} = req;
		let ret;
		let sorting = [...data];

		let sort = _.orderBy(sorting, (item) => {
			return [item.weight/item.height, item.name];
		}, ['asc','asc']);

		return await res.json(limit(sort.map((pokemon)=>pokemon.name), query));
	});

  /*huge - max(pokemon.height)
  */
	router.get("/huge", async function (req, res) {
		let {query, params, data} = req;
		let ret;
		let sorting = [...data];

		let sort = _.orderBy(sorting, ['height', 'name'], ['desc','asc']);

		return await res.json(limit(sort.map((pokemon)=>pokemon.name), query));
	});

  /*light - min(pokemon.weight)
  */
	router.get("/light", async function (req, res) {
		let {query, params, data} = req;
		let ret;
		let sorting = [...data];

		let sort = _.orderBy(sorting, ['weight', 'name'], ['asc','asc']);

		return await res.json(limit(sort.map((pokemon)=>pokemon.name), query));
	});

  /*micro - min(pokemon.height)
  */
	router.get("/micro", async function (req, res) {
		let {query, params, data} = req;
		let ret;
		let sorting = [...data];

		let sort = _.orderBy(sorting, ['height', 'name'], ['asc','asc']);


		return await res.json(limit(sort.map((pokemon)=>pokemon.name), query));
	});

  /*heavy - max(pokemon.weight)
  */
	router.get("/heavy", async function (req, res) {
		let {query, params, data} = req;
		let ret;
		let sorting = [...data];
		let sort = _.orderBy(sorting, ['weight', 'name'], ['desc','asc']);

		return await res.json(limit(sort.map((pokemon)=>pokemon.name), query));
	});

  /*Not Found
  */
	router.all('*', async function (req, res) {
	return await res.status(404).send("Not Found");
  });

  /*An error occured!
  */
  router.use(async function (err, req, res, next) {
	return await res.status(500).send("An error occured!");
  });

	return router;
}


function limit(data, {offset = 0, limit = 20}){
	return data.filter((element) => element).slice(offset).slice(0,limit);
}
