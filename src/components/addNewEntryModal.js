import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { addEntry } from "../api/api";

export default function AddNewEntryModal(props) {
  const { register, handleSubmit, watch, errors } = useForm();
  const [sending, setSending] = useState(false);
  const modal = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  async function onSubmit(data) {
    await setSending(true);
    try {
      let newEntry = await addEntry(data);
      props.listEntries();
      props.setOpenModal({
        status: false,
        cords: { latitude: 0, longitude: 0 },
      })
    } catch (err) {
      if (err) console.error(err);
    }
    setSending(false);
  }

  return (
    <AnimatePresence>
      {props.open.status ? (
        <motion.div
        initial={{ x: 300, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 500, opacity: 1 }}
          style={{
            zIndex: 99999,
            position: "absolute",
            right: "0px",
            top: "0px",
            height: "100vh",
            width: "45vh",
            background: "black",
            color: "#fff",
            padding: "3rem 1.5rem",
          }}
        >
          <h2>Create new entry +</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Control>
              <label htmlFor="title">Title</label>
              <Input ref={register} type="text" name="title" />
            </Control>
            <Control>
              <label htmlFor="description">description</label>
              <Textarea
                ref={register}
                type="text"
                name="description"
              ></Textarea>
            </Control>
            <Control>
              <label htmlFor="comment">Comment</label>
              <Input ref={register} type="text" name="comment" />
            </Control>
            <Control>
              <label htmlFor="image">Image Url</label>
              <Input ref={register} type="url" name="image" />
            </Control>
            <Control>
              <label htmlFor="latitude">Latitude</label>
              <Input
                ref={register}
                type="number"
                value={props.open.cords.latitude}
                name="latitude"
              />
            </Control>
            <Control>
              <label htmlFor="longitude">Longitude</label>
              <Input
                ref={register}
                type="number"
                value={props.open.cords.longitude}
                name="longitude"
              />
            </Control>
            <Control>
              <label htmlFor="rating">Rating</label>
              <Input
                ref={register}
                type="range"
                min={1}
                max={10}
                name="rating"
              />
            </Control>
            <Control>
              <ButtonS disabled={sending}>
                {sending ? "Sending..." : "Create"}
              </ButtonS>
            </Control>
          </form>
          <div
            onClick={() =>
              props.setOpenModal({
                status: false,
                cords: { latitude: 0, longitude: 0 },
              })
            }
          >
            Close
          </div>
        </motion.div>
      ) : null}
      );
    </AnimatePresence>
  );
}

const Control = styled.div`
  width: 100%;
  margin: 1.5rem 0rem;
  color: #ffffff;
`;

const Input = styled.input`
    width: 100%;
    margin-top:.5rem;
    height:35px;
    padding:.3rem .6rem;
    border-radius: 7px;
    border: 2px solid black;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    color: #000 !important;
    // box-shadow: 0px 2px 5px rgba(255,255,255,0.1);
    transition: .3s all;
    cursor:pointer;
  
    &::placeholder{
        text-transform: uppercase;
    }
  
    &:hover, &:focus, &:active{
        outline: #fa4503;
        border: 2px solid #fa4503;
        transition: .3s all;
  
    }
  
    &:disabled{
      color: #fff !important;
    }
  `;

const Textarea = styled.textarea`
  width: 100%;
  margin-top:.5rem;
  height:70px;
  padding:.3rem .6rem;
  border-radius: 7px;
  border: 2px solid black;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  color: #000 !important;
  box-shadow: 0px 2px 5px rgba(255,255,255,0.1);
  transition: .3s all;
  cursor:pointer;
  
  &::placeholder{
      text-transform: uppercase;
  }
  
  &:hover, &:focus, &:active{
      outline: #fa4503;
      border: 2px solid #fa4503;
      transition: .3s all;
  }
  `;

const ButtonS = styled.button`
  background: #fa4503;
  padding: 0.8rem 2rem;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
