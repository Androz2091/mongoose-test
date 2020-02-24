const mongoose = require("mongoose");
const inquirer = require("inquirer");

let createFinish = false;

(async () => {

    // Connexion à la base de données
    await mongoose.connect("mongodb://localhost:27017/test", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch(() => {
        // Si une erreur survient
        console.log('Erreur lors de la connexion à la base de données');
        process.exit(1);
    });

    // Création d'un modèle 'user' qui possède une propriété name et coins
    const user = mongoose.model("user", new mongoose.Schema({
        name: String, 
        coins: Number
    }));

    const createUser = async () => {
        const { name, coins_count } = await inquirer.prompt([
            {
                type: "string",
                name: "name",
                message: "Quel sera le nom de l'utilisateur ?"
            },
            {
                type: "number",
                name: "coins_count",
                message: "Combien de points voulez-vous attribuer à cet utilisateur ?"
            }
        ]);
        const newUser = new user({ name, coins: coins_count });
        await newUser.save();
        return;
    };

    while(!createFinish){
        const { create_user } = await inquirer.prompt([
            {
                type: "string",
                name: "create_user",
                message: "Voulez-vous créer un nouvel utilisateur ? (oui/non)"
            }
        ]);
        if(create_user === "oui"){
            await createUser();
        } else {
            createFinish = true;
        }
    }

    // Cherche les utilisateurs dont le nom est "coucou"
    const usersNamedCoucou = await user.find({ name: "coucou" });
    console.log(`${usersNamedCoucou.length} utilisateurs ont pour nom "coucou" !`);

    // Cherche les utilisateurs qui ont plus de 3 coins
    const usersMoreThan3Coins = await user.find({ coins: { $gt: 3 }});
    console.log(`${usersMoreThan3Coins.length} utilisateurs ont plus de 3 coins !`);

    // Remplace tous les utilisateurs dont le nom est "test" par "ok"
    const { nModified: updateUsers } = await user.updateMany({ name: "test" }, { $set: { name: "ok" }});
    console.log(`${updateUsers} utilisateurs modifiés !`);

    process.exit(0);

})();
