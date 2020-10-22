import React, { useState, useEffect } from "react";
import axios from "axios";
import "./searchBox.scss";

function SearchBox() {
  const [data, setData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [cursor,setCursor] = useState(0)
  const [filter,setFilter] = useState([])

  useEffect(() => {
    axios.get("http://www.mocky.io/v2/5ba8efb23100007200c2750c").then((res) => {
      setData(res.data);
    //   setFilter(res.data);
    });
  },[]);

  const filterData = (val) => {
    const filterVal = data.filter((item,index)=>{
        return(
        item.name.toLowerCase().indexOf(val) !== -1 ||
        item.id.toLowerCase().indexOf(val) !== -1 ||
        item.address.toLowerCase().indexOf(val) !== -1 ||
        item.pincode.toLowerCase().indexOf(val) !== -1
        )
    })
    if(!filterVal.length){
        setFilter("datanotfound")
    } else{
        setFilter(filterVal)
    }
    
  }

const searchChange = (e) =>{
    setSearchVal(e.target.value)
    setCursor(0)
    if(e.target.value===""){
        setFilter([])
    } else{
        filterData(e.target.value.toLowerCase());
    }

    // console.log("result ---->", filterData)
}

// const onEnterPressed=(e)=>{
//     if(e.key="Enter"){
//         filterData(e.target.value)
//     }
// }

// console.log("Data -> ", data[0]);

const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? <span>{part}</span> : part);
}

const handleKeyDown = (e)=> {
    if (e.keyCode === 38 && cursor > 0) {
    setCursor(cursor -1)
    } else if (e.keyCode === 40 && cursor < filter.length - 1) {
    setCursor(cursor +1 )
    }
  }

  return (
    <div className="searchBox">
        <div className="searchBox-input">
            <input 
            value = {searchVal} 
            onChange={searchChange} 
            // onkeyDown={onEnterPressed} 
            type="text" placeholder="Search by User ID, Name, Address"
            autoFocus="autofocus"
            onKeyDown={ handleKeyDown }
            />
        </div>
        <div className="searchBox-result">
            {!Array.isArray(filter) ? <div className="noData"><h3>Data Not Found!!!!</h3></div> : 
            filter.map((item, index) => {
                return (
                <div key={index} className={`searchBox-result-list ${cursor === index ? 'active' : null}`}>
                    <h1>{getHighlightedText (item.id, searchVal)}</h1>
                    <h2>{getHighlightedText (item.name, searchVal)}</h2>
                    <p>{getHighlightedText (item.address, searchVal)}</p>
                    <p>{getHighlightedText (item.pincode, searchVal)}</p>
                    {item.items.map((i,index)=>{
                        return <p key={index}>{getHighlightedText (i, searchVal)}</p>
                    })}
                    
                </div>
            )}) }
        </div>
    </div>
  );
}

export default SearchBox;
