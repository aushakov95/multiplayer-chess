import "dotenv/config";
import express from "express";
import cors from "cors";
import socketio from "socket.io";
import models, { sequelize } from "./models";

const app = express();
app.use(cors());

sequelize.sync({ force: false }).then(() => {
  const server = app.listen(process.env.PORT, () =>
    console.log(`👂 Chess server listening on port ${process.env.PORT}`)
  );

  const io = socketio.listen(server);

  io.on("connection", (socket) => {
    console.log(`✅ Player ${socket.id} connected`);

    socket.on("move", async (msg) => {
      console.log(`move to game ${msg.gameInfo.id}`);

      const { board, move } = msg;
      const gameId = msg.gameInfo.id;

      socket.to(gameId).emit("move", move);
      await models.Game.update(
        { board },
        {
          where: { id: gameId },
        }
      );
    });

    socket.on("createGame", async (msg) => {
      const { gameId, userId } = msg;
      socket.join(gameId);
      const game = {
        id: gameId,
        board: "start",
        players: {},
      };

      game.players[userId] = "white";
      game.players = JSON.stringify(game.players);

      await models.Game.create(game);
    });

    const joinGame = async (game, userId) => {
      socket.join(game.id);

      //Check if this player has joined this game before
      if (!game.players.hasOwnProperty(userId)) {
        game.players[userId] = "black";
      }

      io.in(game.id).emit("startGame", game);
    };

    socket.on("joinGame", async (msg) => {
      const { gameId, userId } = msg;

      const game = await models.Game.findOne({
        where: {
          id: gameId,
        },
      });

      if (game !== null) {
        game.players = JSON.parse(game.players);
        joinGame(game, userId);
      } else {
        io.to(socket.id).emit(
          "joinError",
          "No such game exists or has already ended"
        );
      }
    });

    socket.on("resignFromTheGame", async (gameInfo) => {
      const gameId = gameInfo.id;
      console.log(`Ending game ${gameId}`);
      io.in(gameId).emit("endGame");

      await models.Game.destroy({
        where: { id: gameId },
      });
    });

    socket.on("disconnect", () => {
      console.log(`🎮 🚫Player disconnected`);
    });
  });
});
