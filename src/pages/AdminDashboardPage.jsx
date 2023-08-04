import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router";
import logoutIcon from "../../src/logoutIcon.svg";
import likeIcon from "../../src/likeIcon.svg";
import MkdSDK from "../utils/MkdSDK";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const sdk = new MkdSDK();
const ItemType = "VIDEO";

const AdminDashboardPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;

  let navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await sdk.callRestAPI(
          {
            page: currentPage,
            limit: videosPerPage,
            payload: {},
          },
          "PAGINATE"
        );
        setVideos(response.list);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const DraggableVideo = ({ video, index }) => {
    const [, drag] = useDrag({
      type: ItemType,
      item: { index },
    });

    const [, drop] = useDrop({
      accept: ItemType,
      hover: (draggedItem) => {
        const draggedIndex = draggedItem.index;
        const targetIndex = index;

        if (draggedIndex === targetIndex) {
          return;
        }

        const updatedVideos = [...videos];
        const [draggedVideo] = updatedVideos.splice(draggedIndex, 1);
        updatedVideos.splice(targetIndex, 0, draggedVideo);

        setVideos(updatedVideos);
      },
    });

    return (
      <tr className="mb-4 rounded-lg border border-gray-900 " ref={(node) => drag(drop(node))}>
        <td className="text-center">{video.id}</td>
        <td className="flex items-center justify-center	">
          <img src={video.photo} alt={video.title} className="w-12 text-center mr-3 h-12 object-cover rounded" />
          {video.title}
        </td>
        <td className="text-center">{video.username}</td>
        <td className="flex items-center justify-center	 ">
          <span className="mr-2">          {video.like}
</span>
          <img src={likeIcon} alt="like"/>

        </td>
      </tr>
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full bg-black text-white">
        <nav className="w-full">
       <nav className="w-full">
    <div className="flex items-center justify-between h-16 px-12">
    <div className="text-white text-2xl font-inter font-extrabold text-4xl">APP</div>
      <div className="hidden md:block">
        <div className="ml-10 flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="text-black flex font-inter rounded-full bg-[#9BFF00] w-[128px] h-[48px] p-4 rounded-md text-sm font-medium"
          >
             <img
              src={logoutIcon}
              alt="Logo"
              className="w-[24px] h-[20px] mr-1 " 
            />
          <span className="color-[#050505]  font-inter font-thin h-[20px]">Logout</span>  
          </button>
        </div>
      </div>
    </div>
  </nav>
        </nav>
        <div className="px-20 mt-6 mb-6">
          <span className="font-inter text-3xl font-thin leading-[48px] text-left">
            Today's leaderboard
          </span>
        </div>
        <div className="px-20">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="w-1/4 py-2 px-4">#</th>
                <th className="w-1/4 py-2 px-4">Title</th>
                <th className="w-1/4 py-2 px-4">Author</th>
                <th className="w-1/4 py-2 px-4">Likes</th>
              </tr>
            </thead>
            <tbody className="my-4">
              {videos.map((video, index) => (
                <DraggableVideo key={video.id} video={video} index={index} />
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 px-12 py-2">
            <button
              className="text-black flex font-inter rounded-full bg-[#9BFF00] p-3 text-sm font-sm"
              onClick={handlePrevPage}
            >
              Previous
            </button>
            <button
              className="text-black flex font-inter rounded-full bg-[#9BFF00] p-3 text-sm font-sm"
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default AdminDashboardPage;
