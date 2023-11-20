import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    const typeFromURL = urlParams.get("type");
    const parkingFromURL = JSON.parse(urlParams.get("parking"));
    const furnishedFromURL = JSON.parse(urlParams.get("furnished"));
    const offerFromURL = JSON.parse(urlParams.get("offer"));
    const sortFromURL = urlParams.get("sort");
    const orderFromURL = urlParams.get("order");

    setSidebarData({
      ...sidebarData,
      ...(searchTermFromURL && { searchTerm: searchTermFromURL }),
      ...(typeFromURL && { type: typeFromURL }),
      ...(parkingFromURL && { parking: true }),
      ...(furnishedFromURL && { furnished: true }),
      ...(offerFromURL && { offer: true }),
      ...(sortFromURL && { sort: sortFromURL }),
      ...(orderFromURL && { order: orderFromURL }),
    });

    const getListings = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/getListings?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        setLoading(false);
        if (data.length > 8) setShowMore(true);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    getListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async (e) => {
    e.preventDefault();
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/getListings?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 dark:border-slate-700 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap dark:text-white">Search Term: </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full dark:bg-neutral-700 dark:text-slate-200"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold dark:text-white">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5 dark:accent-neutral-700"
                checked={sidebarData.type == "all"}
                onChange={handleChange}
              />
              <span className="dark:text-slate-300">Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5 dark:accent-neutral-700"
                checked={sidebarData.type == "sale"}
                onChange={handleChange}
              />
              <span className="dark:text-slate-300">Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5 dark:accent-neutral-700"
                checked={sidebarData.type == "rent"}
                onChange={handleChange}
              />
              <span className="dark:text-slate-300">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 dark:accent-neutral-700"
                checked={sidebarData.offer}
                onChange={handleChange}
              />
              <span className="dark:text-slate-300">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold dark:text-white">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 dark:accent-neutral-700"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              <span className="dark:text-slate-300">Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 dark:accent-neutral-700"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              <span className="dark:text-slate-300">Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold dark:text-white">Sort: </label>
            <select
              onChange={handleChange}
              value={`${sidebarData.sort}_${sidebarData.order}`}
              id="sort_order"
              className="border rounded-lg p-3 dark:bg-neutral-700 dark:text-slate-200"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b dark:border-slate-700 p-3 text-slate-700 mt-5 dark:text-white">
          Listing Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full dark:text-white">
              Loading...
            </p>
          )}
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700 text-center w-full dark:text-white">
              No Listings Found!!
            </p>
          )}
          {!loading &&
            listings.length > 0 &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>
        {showMore && !loading && listings.length > 0 && (
          <button
            onClick={handleShowMore}
            className="text-green-700 hover:underline p-7 text-center w-full dark:text-green-500"
          >
            Show More...
          </button>
        )}
      </div>
    </div>
  );
}
