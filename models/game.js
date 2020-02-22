const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema(
    {
      round: String,
      match1: String,
      match2: String,
      match3: String,
      match4: String,
      match5: String,
      match6: String,
      match7: String,
      match8: String,
      match9: String,
      match10: String,
      results: Array,
      users: Array
    },
    {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    }
  );

const Game = mongoose.model('Game', gameSchema);


module.exports = Game;