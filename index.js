import "dotenv/config";
import mongoose from "mongoose";
import mongodb from "mongodb";

console.log(process.env.MONGO_URI);
// Schema creation

const personSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  favoriteFoods: [String],
});

const Person = mongoose.model("persons", personSchema);

// create a person document
const createOnePerson = async () => {
  // Calling the create method on the person collection to create a document under person

  const personCreated = await Person.create({
    name: "John Doe",
    age: 100,
    favoriteFoods: ["Rice", "Yam", "Fish", "Vegetable"],
  });
  console.log(personCreated);

  //   personCreated.save((err, data) => {
  //     if (err) {
  //       console.log("An error occured during the save ", err);
  //     } else {
  //       console.log("Person saved successfully", data);
  //     }
  //   });
  //   return;
};

// create many records with person.model
const people = [
  { name: "James", age: 89, favoriteFoods: ["Plantain", "Sushi", "Bread"] },
  { name: "David", age: 39, favoriteFoods: ["Meat", "Salad", "Pizza"] },
  { name: "Steve", age: 50, favoriteFoods: ["Pasta", "Cake", "Milk"] },
];
console.log(people);

// function to create multiple people
const createPeople = async () => {
  try {
    const peopleArray = await Person.create(people);
    console.log(createPeople);
  } catch (err) {
    console.log(err);
  }
};

// Use model.find() to Search Your Database
const peopleToFind = async () => {
  // find people with the names in the database
  try {
    const people = await Person.find({ name: ["David", "James", "Steve"] });
    console.log(("People found:", people));
  } catch (err) {
    console.log("Persons does not exist in the DB:", err);
  }
};

//Use model.findOne() to Return a Single Matching Document from Your Database using the favorite food as the search engine
const findPersonByFavoriteFood = async (food = ["Pasta", "Cake", "Milk"]) => {
  try {
    // function to find the person with the listed favorite food
    const person = await Person.findOne({ favoriteFoods: { $in: food } });
    if (person) {
      console.log(`Person found`, person);
    } else {
      console.log(`No person found with favorite food ${food}`);
    }
  } catch (err) {
    console.log("No result found for this person");
  }
  return;
};

// Use model.findById() to Search Your Database By _id
const findById = async () => {
  // function to find the person with using their id
  try {
    const personId = await Person.findOne({ _id: "673300a5c6cbf3db9b4ab7f9" });
    if (personId) {
      console.log(personId);
    }
  } catch (err) {
    console.log(err);
  }
};

//Perform Classic Updates by Running Find, Edit, then Save, using a person by _id
const findEditThenSave = async (personId) => {
  try {
    // function to find and update a person with using their id

    const personById = await Person.findById(personId);
    if (!personId) {
      console.log(`Cannot find this person with id: ${personId}`);
      return;
    }
    // Adding Hamburger to the favorite food
    personById.favoriteFoods.push("Hamburger");
    // save the added food.
    const updatedPerson = await personById.save();
  } catch (err) {
    console.log("Error finding and updating the person", err);
  }
  console.log(findEditThenSave);
  return;
};

// Performing New Updates on a Document Using model.findOneAndUpdate()
const updateUserRecords = async () => {
  try {
    // find the person by name and update age
    const updatedPerson = await Person.findOneAndUpdate(
      {
        name: "Steve",
      },
      {
        age: 20,
      },
      {
        new: true,
      }
    );
    if (updatedPerson) {
      console.log("Person updated successfully", updatedPerson);
    } else {
      console.log(`No person found with the name `);
    }
  } catch (err) {
    console.log("Error occured while updating age", err);
  }
  return;
};

//  Delete One Document Using model.findByIdAndRemove

const deletePersonById = async () => {
  // function to find and delete by id
  try {
    const deletePerson = await Person.findByIdAndDelete({
      _id: "673300a5c6cbf3db9b4ab7f9",
    });
    if (deletePerson) {
      console.log("Person with the id deleted successfully", deletePerson);
    } else {
      console.log("No person found with this ID");
    }
  } catch (err) {
    console.log("Error deleting this person");
  }
  return;
};

//MongoDB and Mongoose - Delete Many Documents with model.remove()

const removeManyByName = async () => {
  try {
    const personsToRemove = await Person.remove(
      { name: "John Doe" },
      (err, data) => {
        if (err) {
          console.log("Error removing");
          return;
        }
        return console.log(`person with name ${name} have been deleted`);
      }
    );
  } catch (err) {
    console.log("Error deleting");
  }
  return;
};

//Chain Search Query Helpers to Narrow Search Results
const findPeopleWhoLikeBurritos = async (done) => {
  try {
    const people = await Person.find({ favoriteFoods: "Burritos" })
      .sort({ name: 1 })
      .limit(2)
      .select("-age");
    console.log(people);
  } catch (err) {
    console.log("Error", err);
  }
};

// connect to the daabase
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection to the database, successful");
    await removeManyByName();
    console.log("User created successfully");
  } catch (err) {
    console.log(err);
  }
  return;
};

connectToDatabase();
