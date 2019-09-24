import React, { useRef, useState } from "react";

const UploadImage = ({setImages}) => {
    const fileInput = useRef(null);
    const [loading, setLoading] = useState(false);
    
    const handleFileInput = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        setLoading(true);
        reader.addEventListener("load", async () => {
            const result = await fetch("/api/image", {
                method: "POST",
                body: reader.result,
                headers: new Headers({
                    "contect-type": "text/plain"
                })
            });
            if(result.ok) {
                const images = await result.json();
                setImages(images);
                setLoading(false); 
            } else {
                setLoading(false);
            }
        });
        if(file) {
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="c-upload-image">
            {
                loading ?
                <p>loading...</p>
                :
                <>
                    <input type="file" name="imgFile" ref={fileInput} onChange={handleFileInput} className="file-input" />
                    <button className="btn btn-primary" onClick={() => fileInput.current.click()}>Alustamiseks lae pilt üles</button>
                </>
            }
        </div>
    )
}

export default UploadImage;