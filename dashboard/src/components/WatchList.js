import React,{useState,useContext,useEffect } from "react";
import GeneralContext from "./GeneralContext";

// after material UI  npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
import {Tooltip,Grow} from '@mui/material';
import {BarChartOutlined, KeyboardArrowDown,KeyboardArrowUp, MoreHoriz} from '@mui/icons-material';

import {watchlist} from '../data/data.js';

import { DoughnutChart } from "./DoughnutChart.js";

import axios from "axios";

const WatchList = () => {

  const [livePrices,setLivePrices]=useState({});

  useEffect( ()=>{
      const fetchPrices=async()=>{

        try{
                const response = await axios.get("https://localhost:3002/prices");
                setLivePrices(response.data);
        }
        catch(error){
          console.log("Error in fetching the prices : ",error);
        }
      };
      fetchPrices();

      const interval = setInterval(fetchPrices,2000);

      return ()=>{
        clearInterval(interval);
      }
  },[]);

  const labels = watchlist.map((stock)=>stock.name);

  const data = {
    labels,
    datasets: [
      {
      label: 'Price',
      data: watchlist.map((stock)=>livePrices[stock.name]??stock.price),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
  }
]
  };


  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      <ul className="list">

          {watchlist.map( (stock,index)=>(
              <WatchlistItem stock={stock} livePrice={livePrices[stock.name]??stock.price} key={index} />
            )
          )}

      </ul>
      
      <DoughnutChart data={data}/>

    </div>
  );
};

export default WatchList;


const WatchlistItem = ({stock,livePrice})=>{

    const[showWatchlistActions,setShowWatchlistActions]=useState(false);

    const handleMouseEnter = ()=>{
        setShowWatchlistActions(true);
    }

    const handleMouseExit = ()=>{
        setShowWatchlistActions(false);
    }
    
    const isDown = livePrice < stock.price;

    return(
      <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseExit}>
          <div className="item">
              <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
              <div className="itemInfo">
                <span className="percent">{stock.percent}</span>
                {isDown ?(
                    <KeyboardArrowDown className="down"
                    />
                ):(
                  <KeyboardArrowUp className="up"/>
                )}

                <span className={isDown?"down":"up"}>{livePrice}</span>
              </div>
          </div>
          {showWatchlistActions && (<Actions uid={stock.name}/>)}
      </li>
    );
};

const Actions = ({uid})=>{

    const { openBuyWindow } = useContext(GeneralContext);

    return(
      <span className="actions">
        <span>

          <Tooltip title="Buy" placement="top" arrow="true" TransitionComponent={Grow}>
            <button className="buy" onClick={() => openBuyWindow(uid)}>Buy</button>
          </Tooltip>

          <Tooltip title="Sell" placement="top" arrow="true" TransitionComponent={Grow}>
            <button className="sell">Sell</button>
          </Tooltip>

          <button className="action"><BarChartOutlined className="icon"/></button>

          
          <Tooltip title="More" placement="top" arrow="true" TransitionComponent={Grow}>
            <button className="action"><MoreHoriz className="icon"/></button>
          </Tooltip>

        </span>
      </span>
    );
};