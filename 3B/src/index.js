import express from 'express';
import cors from 'cors';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch'

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';

const app = express();
app.use(cors());

let info={};
fetch(pcUrl)
  .then(async (res) => {
    info = await res.json();
  })
  .catch(err => {
    console.log('ERROR', err);
  });

/*	Получение списка всей исходной базы
*/
app.get( "/", async function(req, res) {
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);
	return await res.json(pc);
});

/*	Получить список пользователей
/users?havePet=cat	Пользователи у которых есть коты
*/
app.get( "/users", async function(req, res) {
let pc =  JSON.stringify(info);
pc =  JSON.parse(pc);

console.log('req = ', req);
console.log('res = ', res);

    if (req.query.havePet) {
         let us = pc.users.filter((user) => {
          let pets = pc.pets.filter((pet) => {
            if(pet.type === req.query.havePet && pet.userId === user.id)
               return true;
          })
          console.log('pets.length = ', pets.length);
          return pets.length > 0;
        })
        console.log('us = ', us);
        return await res.json(us);
      }

      let queryFilter = Object.keys(req.query);

      if (queryFilter.length > 0) {
      			ret = pc.users.filter((user) => {
      				let flag = true;
      				queryFilter.forEach((key) => {
      					flag = user[key] == req.query[key];
      				});

      				return flag;
      			});

      return await res.json(ret);
    }
    else
	     return await res.json(pc.users);
});

app.get( "/users/populate", async function(req, res) {
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);

  let {users} = pc;

  let ret = users.map((user) => {
    let pets = pc.pets.filter((pet) => pet.userId === user.id);
    user.pets = pets;
    return user;
   });

   if (req.query.havePet) {
        let us = ret.filter((user) => {
         let pets = pc.pets.filter((pet) => {
           if(pet.type === req.query.havePet && pet.userId === user.id)
              return true;
         })
         console.log('pets.length = ', pets.length);
         return pets.length > 0;
       })
       console.log('us = ', us);
       return await res.json(us);
     }

   if (!ret.length)
     return await res.status(404).send("Not Found");

   if(ret.length == 1)
     return await res.json(ret[0]);
   else
     return await res.json(ret);
});

/*	Получить данные конкретного пользователя по его ID
Получить данные конкретного пользователя по его username
*/
app.get( "/users/:id", async function(req, res) {
	let ret;
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);

	if (/\D/.test(req.params.id))
		ret = pc.users.filter((users) => users.username == req.params.id);
	else
	  ret = pc.users.filter((users) => users.id == req.params.id);

		if (!ret.length)
		return await res.status(404).send("Not Found");

	return await res.json(ret[0]);
});


/* /users/:username/pets Получить список животных конкретного пользователя по его username/id*/
/* /users/:id/pets	Получить список животных конкретного пользователя по его username/id*/
app.get( "/users/:id/pets", async function(req, res) {
	let ret = [];
	let id;
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);

	if (/\D/.test(req.params.id))
			id = (pc.users.filter((users) => users.username == req.params.id))[0].id;
	else {
			id = req.params.id;
			}

 let pet = pc.pets.filter(function(pet){
	   									return pet.userId == id;
 					});

   if(!pet.length)
        return await res.status(404).send("Not Found");

	return await res.json(pet);
});

/*/users/:usernameOrId/populate
*/
app.get( "/users/:id/populate", async function(req, res) {
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);
  let {users} = pc;

  if (/\D/.test(req.params.id))
  				users = users.filter((user) => user.username == req.params.id).slice(0,1);
  else
  				users = users.filter((user) => user.id == req.params.id);


  let ret = users.map((user) => {
  			let pets = pc.pets.filter((pet) => pet.userId == user.id);
  			user.pets = pets;
  			return user;
  		});

  	if (!ret.length)
  			return await res.status(404).send("Not Found");

  		if(ret.length == 1)
  			return await res.json(ret[0]);
  		else
  			return await res.json(ret);
});

/*
*/
app.get( "/users/:id/pets", async function(req, res) {
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);

  if(params && params.id){
			if (/\D/.test(params.id))
				users = users.filter((user) => user.username == params.id).slice(0,1);
			else
				users = users.filter((user) => user.id == params.id);
		}

		ret = users.map((user) => {
			let pets = data.pets.filter((pet) => pet.userId == user.id);
			user.pets = pets;
			return user;
		});

		if (query.havePet) {
			return await ret.filter((user) => {
				let pets = data.pets.filter((pet) => {
					return pet.userId === user.id && pet.type == query.havePet;
				})

				return pets.length > 0;
			})
		}

		let queryFilter = Object.keys(query);

		if(queryFilter.length > 0){
			ret = ret.filter((pet) => {
				let flag = true;
				queryFilter.forEach((key) =>{
					if(key == 'age_gt')
						flag = flag && pet.age > query[key];
					else if(key == 'age_lt')
						flag = flag && pet.age < query[key];
					else
						flag = flag && pet[key] == query[key];
				});

				return flag;
			});

			return await res.json(ret);
		}

		if (!ret.length)
			return await res.status(404).send("Not Found");

		if(ret.length == 1)
			return await res.json(ret[0]);
		else
			return await res.json(ret);
 return await res.json("/users/:id/pets");
});

/*Получить список животных
*/
app.get( '/pets', async function(req, res) {
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);

let pet=[];

console.log('\nreq = ',req.query);

let queryFilter = Object.keys(req.query);

if(queryFilter.length > 0){
  pet = pc.pets.filter(function(pet){
          let flag = true;
					queryFilter.forEach((key) =>{
						if(key == 'age_gt')
							flag = flag && pet.age > req.query[key];
						else if(key == 'age_lt')
							flag = flag && pet.age < req.query[key];
      			else
							flag = flag && pet[key] == req.query[key];
					});
          return flag;
        });
 	return await res.json(pet);
 }
return await res.json(pc.pets);
});

/*	Получить список животных с пользовательской структурой,
положить пользователя в поле user
*/
app.get( "/pets/populate", async function(req, res) {
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);

var ret = pc.pets.map((pet) => {
 			let user = pc.users.filter((user) => user.id == pet.userId)[0];
 			pet.user = user;
 			return pet;
 		});

 console.log('ret = ', ret);

 		let queryFilter = Object.keys(req.query);

    if(queryFilter.length > 0){
      let pet = pc.pets.filter(function(pet){
              let flag = true;
    					queryFilter.forEach((key) =>{
    						if(key == 'age_gt')
    							flag = flag && pet.age > req.query[key];
    						else if(key == 'age_lt')
    							flag = flag && pet.age < req.query[key];
          			else
    							flag = flag && pet[key] == req.query[key];
    					});
              return flag;
            });

 			return await res.json(pet);
 		}

 		if (!ret.length)
 			return await res.status(404).send("Not Found");

 		if(ret.length == 1)
 			return await res.json(ret[0]);
 		else
 			return await res.json(ret);
});

/*Популяция user в pet
*/
app.get( "/pets/:id/populate", async function(req, res) {
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);

  let petsRes;
  petsRes = pc.pets.filter((pets) => pets.id == req.params.id);

  console.log('\nreq = ',req.query);
	var ret = petsRes.map((pet) => {
   			let user = pc.users.filter((user) => user.id == pet.userId)[0];
   			pet.user = user;
   			return pet;
   		});

   		let queryFilter = Object.keys(req.query);

      if(queryFilter.length > 0){
        let pet = petsRes.filter(function(pet){
                let flag = true;
      					queryFilter.forEach((key) =>{
      						if(key == 'age_gt')
      							flag = flag && pet.age > req.query[key];
      						else if(key == 'age_lt')
      							flag = flag && pet.age < req.query[key];
            			else
      							flag = flag && pet[key] == req.query[key];
      					});
                return flag;
              });

   			return await res.json(pet);
   		}

   		if (!ret.length)
   			return await res.status(404).send("Not Found");

   		if(ret.length == 1)
   			return await res.json(ret[0]);
   		else
   			return await res.json(ret);
});

/*Получить животного по его ID
*/
app.get( "/pets/:id", async function(req, res) {
	let ret;
  let pc =  JSON.stringify(info);
  pc =  JSON.parse(pc);

	ret = pc.pets.filter((pets) => pets.id == req.params.id);

	if (!ret.length)
			return await res.status(404).send("Not Found");

	return await res.json(ret[0]);
});

/*404
*/
app.all('*', async function (req, res) {
		return await res.status(404).send("Not Found");
	});

/*500
*/
app.use(async function (err, req, res, next) {
		return await res.status(500).send("An error occured!");
	});

/*listening
*/
app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
