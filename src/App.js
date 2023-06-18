import React, { useState, useEffect } from "react";
import Header from "./component/Header";
import Draggable from 'react-draggable';
import './App.css';
import { Divider, TextareaAutosize, Typography } from "@mui/material";

export default function App() {

  const [board, setBoard] = useState([])
  useEffect(() => {
    let data = window.localStorage.getItem("data")
    if (data) {
      setBoard(JSON.parse(data))
    } else {
      setBoard([
        {
          id: 1,
          title: 'To Do',
          cards: [
            {
              id: 1,
              title: 'Learn React',
              description: 'Learn the fundamentals of React'
            },
            {
              id: 2,
              title: 'Learn Firebase',
              description: 'Learn the fundamentals of Firebase'
            }
          ]
        },
        {
          id: 2,
          title: 'In Progress',
          cards: [
            {
              id: 3,
              title: 'Learn React Native',
              description: 'Learn the fundamentals of React Native'
            },
            {
              id: 4,
              title: 'Learn GraphQL',
              description: 'Learn the fundamentals of GraphQL'
            }
          ]
        },
        {
          id: 3,
          title: 'Completed',
          cards: [
            {
              id: 5,
              title: 'Learn Node.js',
              description: 'Learn the fundamentals of Node.js'
            },
            {
              id: 6,
              title: 'Learn Express',
              description: 'Learn the fundamentals of Express'
            }
          ]
        }
      ])
    }
  }, [])

  useEffect(() => {
    if (board.length > 0) window.localStorage.setItem("data", JSON.stringify(board))
  }, [board])
  return (
    <div>
      <Header />
      <div>
        <Typography variant="h2" sx={{ marginTop:'50px',fontSize: "2rem", textAlign: "center" }}>
          Kanban Test App
        </Typography>
      </div>
      <div  className="boardContainer">
        {board.map((list) => {
          return (
            <div id={`list_${list.id}`} key={list.id} className="listContainer" >
              <div  className="titleContainer">
                <h2 className="title">{list.title}</h2>
                <button
                  className="newCard"
                  onClick={() => {
                    let temp_boards = [...board]
                    for (let i = 0; i < temp_boards.length; i++) {
                      if (temp_boards[i].id === list.id) {
                        temp_boards[i].cards.push({
                          id: new Date().getTime(),
                          title: 'New Task',
                          description: 'Description'
                        })
                      }
                    }
                    setBoard(temp_boards)
                  }}
                >+ </button>
              </div>
              {list.cards.map((card) => {
                return (
                  <Draggable
                    key={card.id}
                    onStop={(e,) => {
                      let allLists = document.querySelectorAll('.listContainer');
                      for (let i = 0; i < allLists.length; i++) {
                        let list = allLists[i];
                        let rect = list.getBoundingClientRect();
                        let data = {
                          x: e.clientX,
                          y: e.clientY
                        }
                        let flag = false
                        if (data.x > rect.left && data.x < rect.right && data.y > rect.top && data.y < rect.bottom) {
                          let final_list_id = list.id.split('_')[1];
                          let final_card_id = card.id;
                          let temp_boards = [...board]
                          for (let boardIndex = 0; boardIndex < temp_boards.length; boardIndex++) {
                            for (let cardIndex = 0; cardIndex < temp_boards[boardIndex].cards.length; cardIndex++) {
                              if (temp_boards[boardIndex].cards[cardIndex].id === final_card_id) {
                                temp_boards[boardIndex].cards.splice(cardIndex, 1)
                              }
                            }
                          }
                          for (let boardIndex = 0; boardIndex < temp_boards.length; boardIndex++) {
                            if (temp_boards[boardIndex].id === parseInt(final_list_id)) {
                              temp_boards[boardIndex].cards.push(card)
                            }
                          }
                          flag = true
                          setBoard(temp_boards)
                        }
                      }

                    }}
                  >
                    <div  className="cardContainer">
                      <input type={"text"}  className="title" value={card.title}
                        onChange={(e) => {
                          let temp_boards = [...board]
                          for (let i = 0; i < temp_boards.length; i++) {
                            for (let j = 0; j < temp_boards[i].cards.length; j++) {
                              if (temp_boards[i].cards[j].id === card.id) {
                                temp_boards[i].cards[j].title = e.target.value
                              }
                            }
                          }
                          setBoard(temp_boards)

                        }}
                      />
                      <TextareaAutosize minCol='1' type={"text"} className="description" value={card.description}
                        onChange={(e) => {
                          let temp_boards = [...board]
                          for (let i = 0; i < temp_boards.length; i++) {
                            for (let j = 0; j < temp_boards[i].cards.length; j++) {
                              if (temp_boards[i].cards[j].id === card.id) {
                                temp_boards[i].cards[j].description = e.target.value
                              }
                            }
                          }
                          setBoard(temp_boards)


                        }}
                      />
                    </div>
                  </Draggable>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  );
}
