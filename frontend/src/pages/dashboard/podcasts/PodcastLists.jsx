import {
  Avatar,
  Button,
  Menu,
  Pill,
  Select,
  Skeleton,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { SlMagnifier } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import PodcastModal from "../../../components/modals/PodcastModal";
import { useDispatch, useSelector } from "react-redux";
import { getPodcasts } from "../../../redux/actions/podcastsActions";
import { filePath } from "../../../configs/axios.configs";
import {
  AuDepart,
  employeeRanges,
  podcastNiche,
  podcastType,
  revenueRanges,
} from "../../../data/data";
import { parseRange } from "../../../services/helpers/Splitter";
import { CiLock } from "react-icons/ci";

const PodcastLists = () => {
  const [tags, setTags] = useState({
    type: "",
    periodicity: "",
    niche: "",
    revenue: "",
    au_depart: "",
    employees: "",
    sort: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const md = useMediaQuery("(max-width: 767px)");
  const dispatch = useDispatch();
  const { podcastsListLoading, podcastsList } = useSelector(
    (state) => state?.podcasts
  );
  const { user } = useSelector((state) => state?.auth);

  useEffect(() => {
    dispatch(getPodcasts());
  }, []);

  return (
    <div className="pt-0   ">
      <PodcastModal openModal={openModal} setOpenModal={setOpenModal} />

      <div className="p-5 sticky top-0 bg-white z-10 shadow-sm h-full">
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-fontColor text-2xl w-fit font-bold">
            Podcasts & Use Cases
          </h2>
          <div className="flex w-fit gap-3">
            <FilterMenu tags={tags} setTags={setTags} />
            {user.role !== "user" && (
              <Button
                onClick={() => setOpenModal(true)}
                radius={"0"}
                className="px-2 md:!px-5"
                styles={{ label: { fontSize: md ? "10px" : "13px" } }}
                h={"40px"}
                variant="filled"
                color={"#535353"}
              >
                Ajouter un Podcast
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 gap-3 flex">
          {Object.entries(tags).map(
            ([key, value], index) =>
              value && (
                <Pill
                  size="md"
                  key={index}
                  withRemoveButton
                  onRemove={() => {
                    // Create a copy of the object without the removed key
                    const newTags = { ...tags };
                    delete newTags[key];
                    setTags(newTags); // Update the state
                  }}
                >
                  {value}
                </Pill>
              )
          )}
        </div>
      </div>
      <div className="flex flex-col p-3 ">
        {podcastsListLoading ? (
          <>
            <Skeleton height={150}></Skeleton>
            <Skeleton mt={"md"} height={150}></Skeleton>
            <Skeleton mt={"md"} height={150}></Skeleton>
          </>
        ) : podcastsList.length == 0 || podcastsList[0] == null ? (
          <p className="text-fontColor text-xl w-full font-medium text-center">
            No podcasts found
          </p>
        ) : (
          podcastsList.map((item, i) => <PodcastCard key={i} item={item} />)
        )}
      </div>
    </div>
  );
};

const PodcastCard = ({ item }) => {
  const md = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();
  return (
    <div className="w-full flex group mb-4 gap-3 transition-all duration-200 items-start md:flex-nowrap flex-wrap">
      <div className="w-full md:w-1/12 flex flex-row md:flex-col md:justify-center items-center px-3 gap-2 pt-3">
        <Avatar
          size={md ? "md" : "xl"}
          alt={item?.enterpreneur}
          src={filePath + item?.picture}
        >
          {item?.enterpreneur.split("")[0]}
        </Avatar>
        <h4 className="text-fontColor text-[14px] text-center font-semibold">
          {item?.enterpreneur}
        </h4>
      </div>

      <div
        className="md:w-11/12 w-full flex-1 transition-all duration-200 bg-[#f6fbff] group-hover:bg-[#EAF6FF] rounded-xl p-4 px-2.5 md:px-5 cursor-pointer"
        onClick={() =>
          navigate(
            item?.podcast
              ? `/dashboard/podcasts/${item._id}`
              : `/dashboard/plans/buy-plan`
          )
        }
      >
        <div className="w-full flex md:flex-row flex-col justify-between items-start md:items-center">
          <h4 className="text-fontColor font-bold text-lg md:w-6/12 w-full">
            {item.title}
          </h4>
          <div className="flex justify-end gap-3 md:w-6/12 w-full">
            <div className="flex flex-col justify-center items-center w-[30%]">
              <h6 className="text-[clamp(0.75rem,0.6111rem+0.4444vw,1rem)] font-semibold text-fontColor text-center capitalize">
                {item.type}
              </h6>
              <p className="text-[clamp(0.5rem,0.3611rem+0.4444vw,0.75rem)] text-fontColor">
                {item.niche}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center w-[25%] ">
              <h6 className="text-[clamp(0.75rem,0.6111rem+0.4444vw,1rem)] font-semibold text-fontColor capitalize">
                {item.revenue}
              </h6>
              <p className="text-[clamp(0.5rem,0.3611rem+0.4444vw,0.75rem)] text-fontColor">
                {item.periodicity}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center w-[25%]">
              <h6 className="text-[clamp(0.75rem,0.6111rem+0.4444vw,1rem)] font-semibold   text-[#ff6d3f] capitalize">
                {item.au_depart}
              </h6>
              <p className="text-[clamp(0.5rem,0.3611rem+0.4444vw,0.75rem)] text-fontColor">
                Au départ
              </p>
            </div>
            <div className="flex flex-col justify-center items-center w-[20%]">
              <h6 className="text-[clamp(0.75rem,0.6111rem+0.4444vw,1rem)] font-semibold text-fontColor">
                {item?.employees}
              </h6>
              <p className="text-[clamp(0.5rem,0.3611rem+0.4444vw,0.75rem)] text-fontColor">
                Employés
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full gap-2">
          <p className="flex-1 line-clamp-5 md:line-clamp-3 text-[clamp(0.625rem,0.4861rem+0.4444vw,0.875rem)] text-fontColor w-[calc(100%-40px)]  md:text-left text-justify">
            {item?.section1?.content || ""}
          </p>
          <div className="w-[18%] md:w-[8.5%] flex justify-center">
            {item?.podcast ? (
              <Button
                onClick={() => navigate(`/dashboard/podcasts/${item._id}`)}
                color={"#38b6ff"}
                className="max-w-16 !size-5 !text-[8px] md:!size-10 !p-0 md:!text-xl"
                radius={"xl"}
              >
                <FaPlay className="pl-[2px]" />
              </Button>
            ) : (
              <CiLock className="text-4xl font-bold text-fontColor" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterMenu = ({ tags, setTags }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(false);
  const dispatch = useDispatch();

  const handleSearchSubmit = useCallback(() => {
    // Safely parse ranges or default to an empty object
    const au_departs = parseRange(tags?.au_depart) || {};
    const revenue = parseRange(tags?.revenue) || {};
    const employees = parseRange(tags?.employees) || {};
    if (
      tags?.type ||
      tags?.periodicity ||
      tags?.niche ||
      tags?.au_depart ||
      tags?.revenue ||
      tags?.sort
    ) {
      setActiveFilter(true);
    } else {
      setActiveFilter(false);
    }

    dispatch(
      getPodcasts({
        search,
        type: tags?.type || null,
        periodicity: tags?.periodicity || null,
        niche: tags?.niche || null,
        revenueFrom: revenue?.from || null,
        revenueTo: revenue?.to || null,
        au_departFrom: au_departs?.from || null,
        au_departTo: au_departs?.to || null,
        employeesFrom: employees?.from || null,
        employeesTo: employees?.to || null,
        sortBy: tags?.sort == 'Les plus récents' ? 'createdAt' : tags?.sort == 'Les plus lus' ? 'watchCount' : tags?.sort == 'Revenue (du plus haut au plus bas)' ? 'revenue' : tags?.sort == 'Revenue (du plus bas au plus haut)' ? 'revenue' : null || null,
        sortValue: tags?.sort == 'Les plus récents' ? 'desc' : tags?.sort == 'Les plus lus' ? 'desc' : tags?.sort == 'Revenue (du plus haut au plus bas)' ? 'asc' : tags?.sort == 'Revenue (du plus bas au plus haut)' ? 'desc' : null
      })
    );
  }, [tags, search, dispatch]);

  useEffect(() => {
    handleSearchSubmit();
  }, [handleSearchSubmit]);

  return (
    <>
      <TextInput
        radius={"xl"}
        className="!rounded-full  "
        classNames={{ input: "!bg-[#f1efef]" }}
        rightSection={<SlMagnifier />}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        value={search}
      />

      <Menu
        closeOnItemClick={false}
        opened={menuOpened}
        onClose={() => setMenuOpened(false)}
        openDelay={100}
        closeDelay={400}
        shadow="md"
        width={300}
      >
        <Menu.Target>
          <button
            onClick={() => setMenuOpened(true)}
            className={`max-w-16 !size-10 !p-0 text-xl ${activeFilter
              ? "bg-[#38b6ff] text-white"
              : "bg-[#F1EFEF] text-fontColor"
              }  hover:!text-white hover:!bg-[#38b6ff]  rounded-full flex justify-center items-center`}
          >
            <IoFilter />
          </button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label onClick={() => setMenuOpened(true)}>
            <div>
              <div>
                <label>Type</label>
                <Select
                  data={podcastType}
                  className="!rounded-full"
                  variant="filled"
                  radius="xl"
                  searchable
                  clearable
                  value={tags?.type || ""}
                  onChange={(e) => setTags({ ...tags, type: e })}
                />
              </div>
              <div>
                <label>Niche</label>
                <Select
                  data={podcastNiche}
                  className="!rounded-full"
                  variant="filled"
                  radius="xl"
                  searchable
                  clearable
                  value={tags?.niche || ""}
                  onChange={(e) => setTags({ ...tags, niche: e })}
                />
              </div>
              <div>
                <label>Revenue</label>
                <Select
                  data={revenueRanges}
                  className="!rounded-full"
                  variant="filled"
                  radius="xl"
                  searchable
                  clearable
                  value={tags?.revenue || ""}
                  onChange={(e) => setTags({ ...tags, revenue: e })}
                />
              </div>
              <div>
                <label>Periodicité</label>
                <Select
                  data={["revenue / mois", "revenue / an"]}
                  className="!rounded-full"
                  variant="filled"
                  radius="xl"
                  searchable
                  clearable
                  value={tags?.periodicity || ""}
                  onChange={(e) => setTags({ ...tags, periodicity: e })}
                />
              </div>
              <div>
                <label>Au départ</label>
                <Select
                  data={AuDepart}
                  className="!rounded-full"
                  variant="filled"
                  radius="xl"
                  searchable
                  clearable
                  value={tags?.au_depart || ""}
                  onChange={(e) => setTags({ ...tags, au_depart: e })}
                />
              </div>
              <div>
                <label>Employés</label>
                <Select
                  data={employeeRanges}
                  className="!rounded-full"
                  variant="filled"
                  radius="xl"
                  searchable
                  clearable
                  value={tags?.employees || ""}
                  onChange={(e) => setTags({ ...tags, employees: e })}
                />
              </div>
              <div>
                <label>Trier par</label>
                <Select
                  data={[
                    { label: 'Les plus récents ', value: "Les plus récents" }, //most recent
                    { label: 'Les plus lus', value: "Les plus lus" }, //most popular
                    { label: 'Revenue (du plus haut au plus bas)', value: "Revenue (du plus haut au plus bas)" }, //Revenue (highest to lowest)
                    { label: 'Revenue (du plus bas au plus haut)', value: "Revenue (du plus bas au plus haut)" } //Revenue (from lowest to highest)
                  ]}
                  className="!rounded-full"
                  variant="filled"
                  radius="xl"
                  searchable
                  clearable
                  value={tags?.sort || ""}
                  onChange={(e) => setTags({ ...tags, sort: e })}
                />
              </div>
            </div>
          </Menu.Label>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
export default PodcastLists;
