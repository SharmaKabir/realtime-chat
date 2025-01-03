import express from "express";
import { Request, Response } from "express";
import prisma from "../db/prisma.js";

import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req: any, res: any) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // id as in message.route its .post("/send/:id", protectRoute, sendMessage)
    const senderId = req.user.id;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message body is required and must be a string" });
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, receiverId],
        },
      },
    });

    // If the first message then create a new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderId, receiverId],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });

    // Add message to conversation
    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    // TO ADD: socket.io here
    const receiverSocketId=getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error("Error in sendMessage", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export  const getMessages = async (req: any, res: any) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId= req.user.id;
        const conversation = await prisma.conversation.findFirst({
            where:{
                participantIds:{
                    hasEvery:[senderId, userToChatId]
                }
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt:"asc"
                    }
                }
            }
        })
        if(!conversation){
            return res.status(200).json([]);
        }
        res.status(200).json(conversation.messages);
    }   
    catch (error:any) {
        console.log("Error in getMessages", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
};
// export const getMessages = async (req: any, res: any) => {

//     try {
//       const { id: userToChatId } = req.params;
//       const senderId = req.user.id;
  
//       console.log(`Fetching messages between ${senderId} and ${userToChatId}`);
  
//       const conversation = await prisma.conversation.findFirst({
//         where: {
//           participantIds: {
//             hasEvery: [senderId, userToChatId],
//           },
//         },
//         include: {
//           messages: {
//             orderBy: {
//               createdAt: "asc",
//             },
//           },
//         },
//       });
  
//       if (!conversation) {
//         console.log("No conversation found");
//         return res.status(200).json([]);
//       }
  
//       console.log("Conversation found:", conversation);
//       res.status(200).json(conversation.messages);
//     } catch (error: any) {
//       console.error("Error in getMessages", error.message);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };



export const getUsersForSidebar = async (req: any, res: any) => {
    try {
      const userId = req.user.id;
  
      console.log(`Fetching users for sidebar for user ${userId}`);
  
      const users = await prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
        select: {
          id: true,
          username: true,
          fullName: true,
          profilePic: true,
        },
      });
  
      console.log("Users found:", users);
      res.status(200).json(users);
    } catch (error: any) {
      console.error("Error in getUsersForSidebar", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };