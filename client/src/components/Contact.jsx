import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [getLandlordErr, setGetLandlordErr] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const getLandlord = async () => {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          setGetLandlordErr(data.message);
          return;
        }
        console.log(data);
        setLandlord(data);
        setGetLandlordErr(false);
      };
      getLandlord();
    } catch (error) {
      setGetLandlordErr(error.message);
    }
  }, [listing.userRef]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>

          <textarea
            name="message"
            id="message"
            placeholder="Enter your message here..."
            value={message}
            onChange={handleMessageChange}
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
