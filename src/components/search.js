import React, { useState } from "react";
import { variantMarker, variantContainerMarkers } from "../variants";
import { useForm } from "react-hook-form";
import { getEntriesByQuery } from "../api/api";
import { motion } from "framer-motion";
import styled from "styled-components";

export default function Search(props) {
  const { register, handleSubmit } = useForm();
  const [entries, setEntries] = useState([]);

  async function onSubmit(data) {
    if (data.search.length != "") {
      try {
        let entriesFiltered = await getEntriesByQuery(data.search);
        if(entriesFiltered.data.length === 0){
            alert('No results')
        }else{
            setEntries(entriesFiltered.data);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("entre?");
      setEntries([]);
    }
  }

  return (
    <Navigation>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          ref={register}
          style={{ color: "white" }}
          type="text"
          name="search"
          placeholder=""
        />
        <ButtonS type="submit"><svg height='14' width='14' viewBox="0 0 24 24"  stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></ButtonS>
      </form>
      <motion.ul
        variant={variantContainerMarkers}
        initial="false"
        animate="visible"
      >
        {entries.map((entry) => (
          <motion.li
            key={entry._id}
            onClick={() => {
              props.goToEntry(entry.latitude, entry.longitude);
              setEntries([])
            }}
            variant={variantMarker}
            initial="false"
            animate="visible"
          >
            <h4>{entry.title}</h4>
            <span>
              lat:{entry.latitude}, long:{entry.longitude}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </Navigation>
  );
}

const Navigation = styled.nav`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 25rem;
    max-width:550px;
    min-height: 40px;
    z-index: 100;
    background: #111;
    border-radius: 7px;
    border: 2px solid black;
    box-shadow: 0px 2px 5px rgba(0,0,0,0.8);
    

    & form{
        width: 100%;
        height:100%;
        display:flex;
        padding: .3rem;

      
    }

    & input {
        width: 100%;
        height: 100%;
        padding: .8rem .5rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        color: #fff !important;
        transition: .3s all;
        border: none;
        background: transparent;

        cursor:pointer;

        &::placeholder{
            text-transform: uppercase;
        }
        &:hover, &:focus, &:active{
            outline: none;

        }
        @-webkit-keyframes autofill {
            0%,100% {
                color: #666;
                background: transparent;
            }
        }
        
        &:-webkit-autofill {
            -webkit-animation-delay: 1s; /* Safari support - any positive time runs instantly */
            -webkit-animation-name: autofill;
            -webkit-animation-fill-mode: both;
        }
        
    }

    & ul{
        list-style-type: none;

    }
    
    & li{
        color: #fff;
        font-size: .9rem;
        padding: .5rem 1rem;
        border-bottom:1px solid rgba(0,0,0,0.4);
        cursor: pointer;
        transition:.3s all;
        line-height:2;

        &:hover{
            background: gray;
            color: black;
            transition:.3s all;
        }
    }
`;

const ButtonS = styled.button`
  background: #fa4503;
  padding: 0.8rem 2rem;
  color: #fff;
  font-weight: 200;
  text-transform:uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
