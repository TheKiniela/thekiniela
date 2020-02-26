const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema(
    {
      round: String,
      matches: Array,
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