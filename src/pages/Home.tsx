import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCopyOutline } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { MdOutlineOpenInNew, MdClose } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { toast } from "react-toastify";
import "./home.css";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCd6VcU6Is5Kk3HJbCdU02-kHHinlkNuZw",
});

interface OptionType {
  value: string;
  label: string;
}

const options: OptionType[] = [
  { value: "html and css", label: "HTML & CSS" },
  { value: "html with tailwind", label: "HTML & Tailwind" },
  { value: "html with bootstrap", label: "HTML & Bootstrap" },
  { value: "html-css-js", label: "HTML, CSS & JS" },
  { value: "react.js", label: "React.JS" },
  { value: "react.js with tailwind css", label: "React.JS & Tailwind" }
];

const extractCode = (response: string | undefined): string => {
  if (!response) return "";
  const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim() : response.trim();
};

const Home = () => {
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState<OptionType>(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTab, setIsNewTab] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to Clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getResponse = async () => {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, TypeScript, React, Next.js, Vue.js, Angular, and more.

        Now, generate a UI component for: ${prompt}  
        Framework to use: ${frameWork.value}  

        Requirements:  
        The code must be clean, well-structured, and easy to understand.  
        Optimize for SEO where applicable.  
        Focus on creating a modern, animated, and responsive UI design.  
        Include high-quality hover effects, shadows, animations, colors, and typography.  
        Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
        Do NOT include explanations, text, comments, or anything else besides the code.  
        And give the whole code in a single file.
      `,
    });

    setCode(extractCode(response.text) || "");
    setOutputScreen(true);
    setLoading(false);
  };

  const downloadFile = () => {
    const fileName = "genCode.html";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center px-[50px] justify-between gap-[30px]">
        <div className="left w-[50%] h-[80vh] py-[30px] rounded-xl bg-[#141319] mt-5 p-5">
          <h3 className="text-[20px] font-semibold grd-txt">
            AI Component Generator
          </h3>
          <p className="text-[gray] mt-2 text-[16px]">
            Describe your component and let AI do the coding
          </p>
          <p className="text-[15px] font-bold mt-4">Framework</p>
          <Select
            defaultValue={options[0]}
            className="mt-2"
            options={options}
            classNamePrefix="react-select"
            onChange={(selectedOption) => {
              if (selectedOption) {
                setFrameWork(selectedOption);
              }
            }}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1f1f23",
                borderColor: "#333",
                color: "#e5e7eb",
                boxShadow: "none",
                "&:hover": { borderColor: "#555" },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1f1f23",
                border: "1px solid #333",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#2a2a30" : "#1f1f23",
                color: "#e5e7eb",
                "&:active": { backgroundColor: "#2a2a30" },
              }),
              singleValue: (base) => ({
                ...base,
                color: "#e5e7eb",
              }),
              input: (base) => ({
                ...base,
                color: "#e5e7eb",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
              }),
            }}
          />
          <p className="text-[15px] font-bold mt-5">Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="w-full max-h-[80%] min-h-[32%] bg-[#09090b] mt-3 p-2.5"
            placeholder="Describe component in detail and let AI create it for you"
          ></textarea>
          <div className="flex items-center justify-between">
            <p className="text-[gray]">
              Click on generate button to generate the code
            </p>
            <button
              onClick={getResponse}
              className="generate flex items-center justify-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-500 via-purple-700 to-purple-900 mt-3 min-w-[120px] min-h-[50px] px-[20px] gap-[10px] transition-all hover:opacity-[.8]"
              style={{ width: "150px", height: "50px" }} // Fixed size
            >
              {loading ? (
                <div className="loading flex items-center justify-center">
                  <div className="spinner"></div>
                  <span className="ml-[10px]">Generating...</span>
                </div>
              ) : (
                <>
                  <i>
                    <BsStars />
                  </i>
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
        <div className="right relative mt-2 w-[50%] h-[80vh] bg-[#141319] mt-5">
          {outputScreen === false ? (
            <div className="skeleton w-full h-full flex items-center flex-col justify-center">
              <div className="circle p-5 w-[70px] h-[70px] rounded-[50%] bg-gradient-to-r from-purple-500 via-purple-700 to-purple-900 flex items-center justify-center text-[30px]">
                <HiCode />
              </div>
              <p className="text-[16px] text-[gray] mt-2">
                Your component and code will appear here
              </p>
            </div>
          ) : (
            <>
              <div className="top w-full h-[60px] bg-[#17171C] flex items-center gap-[15px] px-5">
                <button
                  onClick={() => setTab(1)}
                  className={`btn w-[50%] p-2.5 rounded-xl cursor-pointer transition-all ${
                    tab === 1 ? "bg-[#333]" : ""
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`btn w-[50%] p-2.5 rounded-xl cursor-pointer transition-all ${
                    tab === 2 ? "bg-[#333]" : ""
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="top-2 w-full h-[60px] bg-[#17171C] flex items-center justify-between gap-[15px] px-5">
                <div className="left">
                  <p className="font-bold">Code Editor</p>
                </div>
                <div className="right flex items-center gap-2.5">
                  {tab === 1 ? (
                    <>
                      <button
                        onClick={copyCode}
                        className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"
                      >
                        <IoCopyOutline />
                      </button>
                      <button
                        onClick={downloadFile}
                        className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"
                      >
                        <BiExport />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsNewTab(true)}
                        className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"
                      >
                        <MdOutlineOpenInNew />
                      </button>
                      <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]">
                        <FiRefreshCcw />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="editor h-full">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    height="100%"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    defaultValue="// some comment"
                  />
                ) : (
                  <iframe
                    srcDoc={code}
                    className="preview w-full h-full bg-white text-black items-center justify-center"
                  ></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isNewTab && (
        <div className="container absolute left-0 top-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto">
          <div className="top w-full h-[60px] flex items-center justify-between px-5">
            <div className="left">
              <p className="font-bold">Preview</p>
            </div>
            <div className="right flex items-center gap-2.5">
              <button
                className="copy w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"
                onClick={() => {
                  setIsNewTab(false);
                }}
              >
                <MdClose />
              </button>
            </div>
          </div>
          <iframe srcDoc={code} className="w-full h-full"></iframe>
        </div>
      )}
    </>
  );
};

export default Home;
