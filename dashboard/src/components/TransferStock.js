import React,{useState,useEffect} from "react";
import axios from "axios";

const API = "http://localhost:3002";

const TransferStock = ()=>{

  const[holdings,setHoldings]=useState([]);
  const[users,setUsers]=useState([]);
  const [history,setHistory]=useState([]);

  const[stock,setStock]=useState("");
  const [receiver,setReceiver]=useState("");
  const [amount,setAmount]=useState("");

  useEffect( ()=>{
    loadData();
  },[]);

  const loadData = async()=>{
    try{
      const h = await axios.get(`${API}/users`,{
        withCredentials:true
      });

      const u = await axios.get(`${API}/users`,{
        withCredentials:true
      });

      const t = await axios.get(`${API}/users`,{
        withCredentials:true
      });

      setHoldings(h.data);
      setUsers(u.data);
      setHistory(t.data);
    }
    catch(err){
      console.log(err);
    }
  };


  const selectedStock = holdings.find(item=>item.name===stock);

  const quantity = selectedStock && amount ? Number(amount)/selectedStock.price:0;

  const transfer = async()=>{

    if(!stock||!receiver||!amount){
      alert("Please fill all fields");
      return;
    }

    try{

      const response = await axios.post( `${API}/TransferStock`,{
        receiverId:receiver,
        stock:stock,
        amount:Number(amount)
      },{
        withCredentials:true
      });

      alert(`Transferred ${response.data.quantity} shares successfully`);

      setAmount("");
      loadData();
      
    }catch(err){
        alert( err.response?.data?.message||"Transfer failed");
    }
  };
  
  return (
    <div>
        <h3>Transfer Stocks</h3>
        
        <div>
          <label>Stock</label>

          <select value={stock} onChange={ (e)=>setStock(e.target.value)}>
          <option value="">Select Stock</option>

          {holdings.map( (item)=>(
            <option key={item._id} value={item.name}> {item.name}-{item.qty}</option>
          ))}
          </select>

          <br></br>

          <label>Recipient</label>

          <br/>

          <select value={receiver} onChange={(e)=>{setReceiver(e.target.value)}}>

            <option value="">Select User</option>

            {users.map( (user)=>(
              <option key={user._id} value={user._id}>{user.name}({user.email})</option>
            ))}
          </select>

          <br></br>
          
          <label>Amount</label>

          <br></br>

          <input type="number" placeholder="Enter Amount" value={amount} onChange={ (e)=>{setAmount(e.target.value)}}></input>

          {selectedStock && amount && (
            <p>Price : {selectedStock.price}
            <br></br>
            Shares to transfer:{quantity.toFixed(4)}</p> 
          )}

          <button onClick={transfer}>Transfer Stock</button>

          </div>

          <h2>Transfer History</h2>

          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Amount</th>

                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {history.map((item)=>(
                <tr key={item._id}>
                <td> {item.stock}</td>
                <td>{Number(item.amount||0).toFixed(2)}</td>

                <td>{Number(item.quantity || 0 ).toFixed(4)}</td>

                <td>{Number(item.price||0).toFixed(2)}</td>
                <td>{new Date(item.date).toLocaleString()}</td>

                </tr>
              ))}

            </tbody>
            </table>
        </div>
  )
}

export default TransferStock;