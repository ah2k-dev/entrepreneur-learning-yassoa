import {
  Avatar,
  Button,
  Image,
  Menu,
  Pill,
  Select,
  Skeleton,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoFilter,
} from "react-icons/io5";
import { SlMagnifier } from "react-icons/sl";
import { Link, useNavigate, useParams } from "react-router-dom";
import AudioPlayer from "../../../components/AudioPlayer";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useMediaQuery } from "@mantine/hooks";
import PodcastModal from "../../../components/modals/PodcastModal";
import {
  DeletePodcasts,
  getSinglePodcasts,
  publishPodcast,
} from "../../../redux/actions/podcastsActions";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { successMessage } from "../../../services/helpers";
import Swal from "sweetalert2";
import custAxios, { filePath } from "../../../configs/axios.configs";
import VimeoAudioPlayer from "../../../components/VimeoAudioPlayer";

const PodcastDetails = () => {
  const { id } = useParams();
  const md = useMediaQuery("(max-width: 767px)");
  const [asideOpen, setAsideOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const sectionRefs = useRef([]);
  const dispatch = useDispatch();
  const { podcastDetailLoading, podcastDetail } = useSelector(
    (state) => state?.podcasts
  );
  const [podcastStatus, setPodcastStatus] = useState("draft");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.auth);

  useEffect(() => {
    const pagewrapper = document.getElementById("pagewrapper");
    const contentHeader = document.getElementById("contentHeader");
    const contentSec = document.getElementById("contentSec");
    const podcastAsideMenu = document.getElementById("podcastAsideMenu");
    const podcastMenuPublishSec =
      document.getElementById("podcastMenuPublishSec") || 0;
    let contentSecHeight =
      pagewrapper.clientHeight - contentHeader.clientHeight;
    contentSec.style.height = contentSecHeight + "px";
    podcastAsideMenu.style.height =
      contentSecHeight - podcastMenuPublishSec.clientHeight + "px";

    if (md) {
      setAsideOpen(false);
    } else {
      setAsideOpen(true);
    }
  }, [md]);

  useEffect(() => {
    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold to your preference
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      // Cleanup observer
      Object.values(sectionRefs.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [md]);

  const handleFetchPodi = async () => {
    try {
      let resp = await dispatch(getSinglePodcasts(id));
      if (resp.success) {
        if (!resp.data.podcast) {
          navigate("/dashboard/plans/list");
        } else {
          const alreadyIds = localStorage.getItem('viewedPodcast') ? JSON.parse(localStorage.getItem('viewedPodcast')) : [];
          console.log('alreadyIds ', alreadyIds);

          if (!alreadyIds.includes(resp.data._id)) {
            const res = await custAxios.patch("/podcast/watch/" + id);
            if (res?.data?.success) {
              alreadyIds.push(resp.data._id);
              localStorage.setItem('viewedPodcast', JSON.stringify(alreadyIds))
            }
          }
        }
      }

    } catch (error) {
      console.log('error ', error)
    }
  };
  useEffect(() => {
    handleFetchPodi();
  }, []);

  const handlePublishedPodcast = async () => {
    try {
      let podRes = await dispatch(publishPodcast(podcastDetail?._id));
      if (podRes.published) {
        successMessage("Podcast successfully published");
      } else {
        successMessage("Podcast move to draft");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setPodcastStatus(podcastDetail?.published ? "publish" : "draft");
  }, [podcastDetail]);

  return (
    <div
      id="pagewrapper"
      className="px-4 md:p-4 flex flex-col overflow-hidden h-full"
    >
      <Header item={podcastDetail} activeSection={activeSection} />
      <div
        id="contentSec"
        className="flex relative pt-2 md:pt-4 overflow-auto scroll-smooth"
      >
        <div
          style={{
            width: asideOpen ? "100%" : "12px",
            background: asideOpen ? "white" : "transparent",
          }}
          className={`bg-white overflow-x-hidden overflow-y-auto transition-all duration-200 shadow-2xl md:shadow-none max-w-[200px] w-0 md:w-full flex flex-col justify-between items-center fixed md:sticky top-0 left-0 z-40 h-full pt-3 ${asideOpen ? "px-2" : "px-0"
            } md:px-0 md:pt-0 `}
        >
          <div className="h-full flex flex-col justify-between min-h-[289px] gap-3">
            <div
              style={{
                width: asideOpen ? "100%" : "0",
                paddingRight: asideOpen ? "1rem" : "0",
              }}
              className="h-fit flex-1 overflow-hidden md:overflow-y-auto pt-2 relative"
              id="podcastAsideMenu"
            >
              <SectionsAside
                podcastDetail={podcastDetail}
                activeSection={activeSection}
                id={"section1"}
              />
              <SectionsAside
                podcastDetail={podcastDetail}
                activeSection={activeSection}
                id={"section2"}
              />
              <SectionsAside
                podcastDetail={podcastDetail}
                activeSection={activeSection}
                id={"section3"}
              />
              <SectionsAside
                podcastDetail={podcastDetail}
                activeSection={activeSection}
                id={"section4"}
              />
              <SectionsAside
                podcastDetail={podcastDetail}
                activeSection={activeSection}
                id={"section5"}
              />
              <SectionsAside
                podcastDetail={podcastDetail}
                activeSection={activeSection}
                id={"section6"}
              />
            </div>
            {user.role !== "user" && (
              <div
                id="podcastMenuPublishSec"
                style={{
                  width: asideOpen ? "100%" : "0",
                  paddingRight: asideOpen ? "1rem" : "0",
                }}
                className="w-[90%] overflow-x-hidden relative"
              >
                <Select
                  styles={{
                    input: {
                      background: "#ff6c3d",
                      borderRadius: "50px",
                      color: "white",
                      fontFamily: "Poppins",
                      fontWeight: "500",
                      outline: "none",
                    },
                  }}
                  onChange={(e) => {
                    handlePublishedPodcast();
                    setPodcastStatus(e);
                  }}
                  value={podcastStatus}
                  rightSection={<HiMiniChevronUpDown className="!text-white" />}
                  defaultValue={podcastDetail?.published ? "publish" : "draft"}
                  data={[
                    { label: "Publier", value: "publish" },
                    { label: "Draft", value: "draft" },
                  ]}
                />

                <p className="text-center text-fontColor mt-2 text-xs">
                  {podcastDetail?.publishedAt}
                </p>
              </div>
            )}
          </div>
          <div
            onClick={() => setAsideOpen(!asideOpen)}
            className="cursor-pointer flex rounded-sm justify-center items-center absolute h-20 bg-slate-100 hover:bg-slate-300 w-3 right-0 bottom-[30%] md:top-[40%] translate-y-[-40%]"
          >
            <IoChevronBackOutline />
          </div>
        </div>

        <div
          id="seacs"
          className="px-4 md:px-8 scroll-smooth overflow-auto"
          style={{ width: "100%" }}
        >
          <SectionsContent
            sectionRefs={sectionRefs}
            podcastDetail={podcastDetail}
            id={"section1"}
          />
          <SectionsContent
            sectionRefs={sectionRefs}
            podcastDetail={podcastDetail}
            id={"section2"}
          />
          <SectionsContent
            sectionRefs={sectionRefs}
            podcastDetail={podcastDetail}
            id={"section3"}
          />
          <SectionsContent
            sectionRefs={sectionRefs}
            podcastDetail={podcastDetail}
            id={"section4"}
          />
          <SectionsContent
            sectionRefs={sectionRefs}
            podcastDetail={podcastDetail}
            id={"section5"}
          />
          <SectionsContent
            sectionRefs={sectionRefs}
            podcastDetail={podcastDetail}
            id={"section6"}
          />
        </div>
      </div>
    </div>
  );
};

const Header = ({ item, activeSection }) => {
  const md = useMediaQuery("(max-width: 767px)");
  const [openModal, setOpenModal] = useState(false);
  const { podcastDetailLoading, podcastDetail } = useSelector(
    (state) => state?.podcasts
  );
  const { user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let resp = await dispatch(DeletePodcasts(id));
          if (resp) {
            Swal.fire({
              title: "Deleted!",
              text: "Podcast has been deleted.",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/dashboard/podcasts");
              }
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div
      id="contentHeader"
      className="w-full flex md:flex-row flex-col pt-2 md:pt-0 mb-2 md:mb-4 gap-2 md:gap-3 items-center bg-white z-20 h-fit md:h-fit"
    >

      <PodcastModal
        data={item}
        openModal={openModal}
        setOpenModal={setOpenModal}
        activeSection={activeSection}
      />
      <div className="flex md:flex-col justify-start md:justify-center items-center gap-2 md:px-3 w-full md:w-fit">
        {podcastDetailLoading ? (
          <>
            <Skeleton
              w={md ? "90px" : "80px"} h={md ? "90px" : "80px"} radius={'100px'} />
            <Skeleton h={20} mt={2} />
          </>
        ) : (
          <>
            <Avatar
              size={md ? "md" : "xl"}
              alt={item?.enterpreneur}
              src={filePath + item?.picture}
            >
              {item?.enterpreneur?.split("")[0]}
            </Avatar>
            <h4 className="text-fontColor text-[14px]  text-center font-semibold">
              {item?.enterpreneur || "enterpreneur"}
            </h4>
          </>
        )}

      </div>

      <div className="w-full mt-1 md:mt-5 relative">
        <div className="w-full flex md:flex-row flex-col justify-between items-start md:items-center bg-[#f6fbff] rounded-md md:rounded-full p-2 md:p-4 px-5 ">
          {podcastDetailLoading ? (
            <Skeleton h={20} mt={2} className="!w-[200px]" />
          ) : (
            <h4 className="text-fontColor mb-1 md:mb-0 font-bold text-sm md:text-lg">
              {item?.title || "title"}
            </h4>
          )}

          <div className="flex justify-end gap-3">
            {podcastDetailLoading ? (
              <>
                <Skeleton h={40} mt={2} className="!w-[80px]" />
                <Skeleton h={40} mt={2} className="!w-[80px]" />
                <Skeleton h={40} mt={2} className="!w-[80px]" />
                <Skeleton h={40} mt={2} className="!w-[80px]" />
              </>
            ) : (
              <>
                <div className="flex flex-col justify-center items-center">
                  <h6 className="text-[clamp(0.75rem,0.6111rem+0.4444vw,1rem)] font-semibold text-fontColor capitalize">
                    {item?.type}
                  </h6>
                  <p className="text-[clamp(0.5rem,0.3611rem+0.4444vw,0.75rem)] text-fontColor">
                    {item?.niche}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h6 className="text-[clamp(0.75rem,0.6111rem+0.4444vw,1rem)] font-semibold text-fontColor capitalize">
                    {item?.revenue}
                  </h6>
                  <p className="text-[clamp(0.5rem,0.3611rem+0.4444vw,0.75rem)] text-fontColor">
                    {item?.periodicity}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h6 className="text-[clamp(0.75rem,0.6111rem+0.4444vw,1rem)] font-semibold   text-[#7ed957] capitalize">
                    {item?.au_depart}
                  </h6>
                  <p className="text-[clamp(0.5rem,0.3611rem+0.4444vw,0.75rem)] text-fontColor">
                    Au départ
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h6 className="text-[clamp(0.75rem,0.6111rem+0.4444vw,1rem)] font-semibold text-fontColor">
                    {item?.employees}
                  </h6>
                  <p className="text-[clamp(0.5rem,0.3611rem+0.4444vw,0.75rem)] text-fontColor">
                    Employés
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-2 md:gap-5 items-center relative">
          {/* <AudioPlayer
                        src={item?.podcast}
                    /> */}
          {podcastDetailLoading ? <Skeleton height={40} mt={6} radius={'10px'} className="!w-full" /> : <VimeoAudioPlayer src={item?.podcast} />}
          {user.role !== "user" && (
            <Menu shadow="md" width={200} className="relative">
              <Menu.Target>
                <Button variant="subtle" className="!min-w-0 !px-1 !w-6 !py-1">
                  <BsThreeDotsVertical className="text-fontColor text-3xl cursor-pointer" />
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={() => setOpenModal(true)}>Update</Menu.Item>
                <Menu.Item color="red" onClick={() => handleDelete(item?._id)}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </div>
    </div >
  );
};


const SectionsAside = ({ podcastDetail, activeSection, id }) => {
  const { podcastDetailLoading } = useSelector(
    (state) => state?.podcasts
  );

  return !podcastDetailLoading ? (
    podcastDetail && podcastDetail[id]?.title && (
      <a
        href={`#${id}`}
        className={`transition-all duration-200 block p-2 w-full mb-1 pl-6 rounded-full ${activeSection === id
          ? "bg-[#38b6ff] text-white"
          : "bg-gray-200 text-black"
          }`}
      >
        {podcastDetail[id]?.title}
      </a>
    )
  ) : (
    <Skeleton height={40} mt={6} radius={'100px'} className="!w-full" />
  );
};

const SectionsContent = ({ podcastDetail, sectionRefs, id }) => {
  const { podcastDetailLoading } = useSelector(
    (state) => state?.podcasts
  );
  return !podcastDetailLoading ? (
    podcastDetail && podcastDetail[id]?.title && (
      <div
        id={id}
        className="item min-h-full mb-4"
        ref={(el) => (sectionRefs.current[id] = el)}
      >
        <h4 className="text-lg md:text-lg lg:text-2xl font-bold text-fontColor">
          {podcastDetail[id]?.title || id}
        </h4>
        <p className="text-sm text-fontColor md:text-left text-justify">
          {podcastDetail[id]?.content}
        </p>
        <Image
          src={filePath + podcastDetail[id]?.image}
          alt={podcastDetail[id]?.title}
          className="max-w-[400px] w-full mx-auto mt-8 h-3/4"
        />
      </div>
    )
  ) : (
    <div className="item min-h-full mb-8 w-full h-full">
      <Skeleton height={30} mt={6} width={200} />
      <Skeleton height={10} mt={6} className="!w-full" />
      <Skeleton height={10} mt={2} className="!w-full" />
      <Skeleton height={10} mt={2} className="!w-full" />
      <Skeleton mt={20} className="max-w-[400px] w-full mx-auto !h-3/4" />
    </div>
  );
};

export default PodcastDetails;
