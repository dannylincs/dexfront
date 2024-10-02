// import { useState } from "react";
// import axios from "axios";
// import "./FileUpload.css";
// const FileUpload = ({ contract, account, provider }) => {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No image selected");
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (file) {
//       try {
//         const formData = new FormData();
//         formData.append("file", file);

//         const resFile = await axios({
//           method: "post",
//           url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//           data: formData,
//           headers: {
           
//             pinata_api_key: process.env.REACT_APP_PINATA_API_KEY, // Used env vars for security
//             pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,

//             "Content-Type": "multipart/form-data",
//           },
//         });
//         const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
//         contract.add(account,ImgHash);
//         alert("Successfully Image Uploaded");
//         setFileName("No image selected");
//         setFile(null);
//       } catch (e) {
//         alert("Unable to upload image to Pinata");
//       }
//     }
//     alert("Successfully Image Uploaded");
//     setFileName("No image selected");
//     setFile(null);
//   };
//   const retrieveFile = (e) => {
//     const data = e.target.files[0]; //files array of files object
//     // console.log(data);
//     const reader = new window.FileReader();
//     reader.readAsArrayBuffer(data);
//     reader.onloadend = () => {
//       setFile(e.target.files[0]);
//     };
//     setFileName(e.target.files[0].name);
//     e.preventDefault();
//   };
//   return (
//     <div className="top">
//       <form className= "form" onSubmit={handleSubmit}>
//         <label htmlFor= "file-upload" className="choose">
//           Choose Image
//         </label>
//         <input
//           disabled={!account}
//           type="file"
//           id="file-upload"
//           name="data"
//           onChange={retrieveFile}
//         />
//         <span className="textArea">Image: {fileName}</span>
//         <button type= "submit" className="upload" disabled={!file}>
//           Upload File
//         </button>
//       </form>
//     </div>
//   );
// };
// export default FileUpload;





import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [loading, setLoading] = useState(false);

  // File validation (type and size)
  const retrieveFile = (e) => {
    const data = e.target.files[0];

    if (!data) {
      alert("No file selected.");
      return;
    }

    // Check if file is an image
    if (!data.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    // Check if file size exceeds 5MB
    if (data.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB.");
      return;
    }

    // Read the file and set state
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
    setFileName(data.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      alert("Please connect your wallet before uploading.");
      return;
    }

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    setLoading(true); // Show loading state

    try {
      // Prepare file for Pinata upload
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY, // Frontend: Caution! Use backend for better security.
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },

        

      });

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

      // Interact with the smart contract to store IPFS hash
      try {
        await contract.add(account, ImgHash);
        alert("Successfully Image Uploaded and added to Contract.");
      } catch (contractError) {
        alert("Image uploaded but failed to add to contract.");
        console.error("Contract Error: ", contractError);
      }

      // Reset state after success
      setFileName("No image selected");
      setFile(null);

    } catch (e) {
      if (!e.response) {
        alert("Network error, please try again later.");
      } else {
        alert("Unable to upload image to Pinata.");
        console.error("Pinata Error: ", e);
      }
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account || loading}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;







