import express from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../models/Recipies.js";
import { UserModel } from "../models/Users.js";

const router = express.Router();

//get all the recipes

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    return res.json(response);
  } catch (err) {
    res.json(err);
  }
});

//create a new recipe

router.post("/", async (req, res) => {
  //take the data from the req
  const recipe = new RecipeModel(req.body);
  try {
    const response = await recipe.save();
    return res.json(response);
  } catch (err) {
    res.json(err);
  }
});

//save route >>>here we are using a post methode because we have to update the users database when the user add a new recipie to the list by saveing
router.put("/", async (req, res) => {
  try {
    //the saving recipe
    const recipe = await RecipeModel.findById(req.body.recipeId);
    const user = await UserModel.findById(req.body.userId);

    user.savedRecipes.push(recipe);
    await user.save();

    return res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

//get the user only saved recepies
router.get("/saved-recipes", async (req, res) => {
  try {
    //take the user
    const user = await UserModel.findById(req.body.userId);
    //take all the recipies where the _id in recipes in user>savedRecipies
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    //list of recipe objects
    return res.json(savedRecipes);
  } catch (err) {
    return res.json(err);
  }
});

//get a single user saved reccipee
router.get("saved-recipes/ids", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);

    return res.json({ savedRecipes: user?.savedRecipes }); //user can be null
  } catch (err) {
    return res.json(err);
  }
});

//export
export { router as RecipeRouter };
