import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect("mongodb+srv://anuruddhpratapsingh82974:wjjeQ8WPr1oVwnHU@cluster0.ybgeudz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      dbName: "taskManagement",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some Error occured. ${err}`);
    });
};
