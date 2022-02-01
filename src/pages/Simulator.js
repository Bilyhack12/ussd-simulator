import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loadingIcon from '../assets/loading.png'

function Simulator() {
  const [serverUrl, setServerUrl] = useState('');
  const [responseLabel, setResponseLabel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('*100#');
  const [text, setText] = useState('');
  const [result, setResult] = useState({})

  const saveConfig = ()=>{
      localStorage.setItem("SERVER_URL", serverUrl);
      localStorage.setItem("RESPONSE_LABEL", responseLabel);
      localStorage.setItem("PHONE_NUMBER", phoneNumber);
      document.getElementById("alert").classList.remove("hidden")
      setTimeout(()=>{
        document.getElementById("alert").classList.add("hidden")
      },2500)
  }

  const showError = (err)=>{
    document.getElementById("ussd-error").innerHTML=err;
    document.getElementById("ussd-error").classList.remove("hidden")
    setTimeout(()=>{
        document.getElementById("ussd-error").classList.remove("hidden")
        document.getElementById("ussd-error").innerHTML = ""
    },2500)
  }

  const sendRequest = async()=>{
        if(query === "") return;
        setLoading(true);
        try{
            const response = await axios.get(`${serverUrl}`, {
                params:{
                    ...result,
                    [responseLabel]: query,
                    "msisdn": phoneNumber
                }
            })
            setResult(response.data);
            setQuery("");
            console.log(response.data)
            setText(response.data[responseLabel])
        }catch(e){
            showError(e.message)
        }finally{
            setLoading(false)
        }
  }
  const cancelUSSD = async()=>{
      setQuery("*100#");
      setText("");
      setResult({})
  }

  useEffect(()=>{
    setServerUrl(localStorage.getItem("SERVER_URL") || '')
    setResponseLabel(localStorage.getItem("RESPONSE_LABEL") || '')
    setPhoneNumber(localStorage.getItem("PHONE_NUMBER") || '')
  },[])
  return (
    <div className="flex mx-12 h-[800px] flex">
        <div className="my-4 mr-12 flex flex-col">
            <div className="bg-android-phone bg-contain max-w-full w-[341px]">
                <div className="w-[287px] flex h-[580px] my-8 mx-7 rounded-lg flex justify-center items-center">
                    <div className="w-5/6 font-roboto text-white px-5 pt-5 pb-3 bg-[#424242] rounded-md">
                        {
                            loading ? (
                                <div className='pt-5 pb-7 flex justify-center items-center'>
                                    <img alt="loading" src={loadingIcon} className="w-9 h-9 animate-spin"/>
                                </div>):(
                                <>
                                    <div className="text-sm mb-4" id='menu-text' dangerouslySetInnerHTML={{__html: text || "Dial a code"}}></div>
                                    <input value={query} onChange={(e)=>setQuery(e.target.value)} className="bg-transparent mb-1 border-b-[1px] border-solid border-[#FFFFFF61] text-white text-sm outline-none block w-full" autocomplete="off"></input>
                                    <p className="text-sm text-[#FF4C00] mb-1 hidden" id="ussd-error">Network Error</p>
                                    <div className="flex justify-between">
                                        <button onClick={cancelUSSD} className="text-sm text-[#FF4C00] border-none bg-transparent uppercase font-roboto py-2 px-3 mx-2">Cancel</button>
                                        <button onClick={sendRequest} className="text-sm text-[#FF4C00] border-none bg-transparent uppercase font-roboto py-2 px-3 mx-2">Send</button>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div className="my-12">
                <h1 className='text-white text-2xl font-bold'>USSD Simulator</h1>
            </div>
            <div>
                <div>
                    <div className="mb-7">
                        <label for="phone-type" className="text-white text-sm font-semibold"><h4>Server URL</h4></label>
                        <input value={serverUrl} onChange={(e)=>setServerUrl(e.target.value)} className="p-2 rounded w-96 mt-1" placeholder="http://localhost:3000/ussd/simulator"/>
                    </div>
                    <div className="mb-7">
                        <label for="phone-type" className="text-white text-sm font-semibold"><h4>Phone Number</h4></label>
                        <input value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} className="p-2 rounded w-56 mt-1" placeholder="233558331258"/>
                    </div>
                    <div className="mb-7">
                        <label for="phone-type" className="text-white text-sm font-semibold"><h4>Response Label</h4></label>
                        <input value={responseLabel} onChange={(e)=>setResponseLabel(e.target.value)} className="p-2 rounded w-36 mt-1" placeholder="userdata"/>
                    </div>
                    <div className="mb-1">
                        <button onClick={saveConfig} className="py-2 px-3 text-white rounded bg-[steelblue] text-sm font-bold">Save Config</button>
                    </div>
                    <h3 className="text-[#22AA33] hidden" id="alert">Successfully Saved !</h3>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Simulator;
