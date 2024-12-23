import {
  Button,
  Grid,
  Menu,
  Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import coursesImage from "/public/courses/course-poster.webp";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { FaPlay } from "react-icons/fa6";
import AddCourseModal from "../../../components/modals/AddCourse";
import { useDispatch, useSelector } from "react-redux";
import { DeleteCourse, getCourses } from "../../../redux/actions/coursesAction";
import Swal from "sweetalert2";
import { filePath } from "../../../configs/axios.configs";
import VimeoCustomPlayer from "../../../components/VimeoCustomPlayer";
import { useNavigate } from "react-router-dom";

const CoursesLists = () => {
  const md = useMediaQuery('(max-width: 767px)');
  const [openModal, setOpenModal] = useState(false);
  let localStorageStep = localStorage.getItem('courseStep') || null
  const [activeSection, setActiveSection] = useState(localStorageStep ? localStorageStep : 'step1');
  const { user } = useSelector((state) => state?.auth);
  const { coursesList, coursesListLoading } = useSelector((state) => state?.course);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCourses(activeSection));
  }, [activeSection])


  return (
    <div className='pt-0 '>
      <AddCourseModal openModal={openModal} setOpenModal={setOpenModal} />
      <div className='p-5 sticky top-0 bg-white z-10 shadow-sm h-full'>
        <div className='flex justify-between items-center flex-wrap'>
          <h2 className='text-fontColor text-lg md:text-2xl w-fit font-bold'>
            Cours et Ateliers d’Entreprenariat
          </h2>
          <div className='flex w-fit items-center justify-between md:justify-end gap-3'>
            {user.role !== 'user' && (
              <Button onClick={() => setOpenModal(true)} radius={'0'} className='px-2 md:!px-5' styles={{ label: { fontSize: md ? '10px' : '13px' } }} h={'40px'} variant='filled' color={'#535353'}>
                Ajouter un contenu
              </Button>
            )}
          </div>
        </div>

        <div className='mt-3 gap-3 items-center flex overflow-x-auto courseStepsList'>
          <button

            onClick={() => { setActiveSection(`introduction`); localStorage.setItem('courseStep', `introduction`) }}
            className={`capitalize transition-all duration-200 block text-sm md:text-base py-2 px-4 md:px-10 mb-1 hover:bg-blue-300 hover:text-white rounded-full ${activeSection === `introduction` ? 'bg-[#38b6ff] text-white' : 'bg-gray-200 text-fontColor'}`}>
            Introduction
          </button>
          {Array.from({ length: 5 }, (_, i) => (
            <button
              onClick={() => { setActiveSection(`step${i + 1}`); localStorage.setItem('courseStep', `step${i + 1}`) }}
              key={i}
              className={`capitalize transition-all duration-200 block text-sm md:text-base py-2 px-4 min-w-[max-content] md:px-10 mb-1 hover:bg-blue-300 hover:text-white rounded-full ${activeSection === `step${i + 1}` ? 'bg-[#38b6ff] text-white' : 'bg-gray-200 text-fontColor'
                }`}>
              Etape {i + 1}
            </button>
          ))}
        </div>
      </div>
      {activeSection == 'introduction' ?
        (
          <IntroSection />
        ) : (
          <Grid >
            <Grid.Col span={12}>
              <h3 className='text-fontColor text-xl w-fit font-bold pl-6 mt-3'>
                Master Knowing yourself
              </h3>
            </Grid.Col>
            {
              coursesListLoading ? (
                <CourseSkeleton />
              ) :
                coursesList.length == 0 || coursesList == null ? (
                  <p className='text-fontColor text-xl w-full font-medium text-center'>
                    No Courses found
                  </p>
                ) :
                  coursesList.map((item, i) => (
                    <Grid.Col span={{ base: 12, md: 6, xl: 4 }}>
                      <CoursesCard item={item} key={i} activeSection={activeSection} />
                    </Grid.Col>
                  ))
            }
          </Grid >
        )}


    </div >
  );
};

const CoursesCard = ({ item, activeSection }) => {
  const { user } = useSelector((state) => state?.auth);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          let resp = await dispatch(DeleteCourse(id));
          if (resp) {
            Swal.fire({
              title: "Deleted!",
              text: "Course has been deleted.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) {
                // dispatch(getBusiness());
              }
            })
          }

        }
      });

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='py-2.5 px-5'>
      <AddCourseModal data={item} openModal={openModal} setOpenModal={setOpenModal} />
      <h4 className='text-[#38b6ff] font-bold text-sm sm:text-base md:text-xl'>{item?.title} </h4>
      <div className='w-full h-full aspect-video relative min-h-[200px] max-h-[35vh] cursor-pointer'
        onClick={() => { item?.video ? navigate(`/dashboard/courses/${activeSection}/${item?._id}`) : navigate('/dashboard/plans/buy-plan') }}
      >

        <img src={filePath + item?.thumbnail} className='!h-full aspect-video object-cover !w-full' />
        <Button
          color={'#38b6ff'}
          className="max-w-16 !size-5 !text-[8px] md:!size-10 !p-0 md:!text-xl !absolute !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%] z-[1]"
          radius={'xl'}
        >
          <FaPlay />
        </Button>

      </div>
      <p className='text-black text-xs md:text-sm mt-2 line-clamp-3'>
        {item?.description}
      </p>
      <div className='flex justify-between items-center mt-3'>

        {user.role == 'admin' && (
          <Menu shadow="md" width={200} className='relative'>
            <Menu.Target>
              <button className='px-2 py-1 hover:bg-slate-200 text-2xl text-fontColor rounded-md'>
                <BsThreeDots />
              </button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={() => setOpenModal(true)}
              >
                Update
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() => handleDelete(item?._id)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </div>
  )
}

const IntroSection = () => {
  const { coursesList, coursesListLoading } = useSelector((state) => state?.course);
  const { user } = useSelector((state) => state?.auth);
  const navigate = useNavigate();
  const [isVideoPlay, setIsVIdeoPlay] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <AddCourseModal data={coursesList[0]} openModal={openModal} setOpenModal={setOpenModal} />
      <Grid>
        <Grid.Col span={12}>
          <div className="flex items-center">

            <h3 className='text-fontColor flex-1 text-xl mt-3 font-bold pl-6 w-full'>
              {coursesList[0]?.title || "Andy, Rejoins la communauté et accède à plus de 1000 Podcasts et étude de cas En business, c’est mieux d’être accompagné que d’être seul !"}
            </h3>
            {user.role == 'admin' && (
              <Menu shadow="md" width={200} className='relative'>
                <Menu.Target>
                  <button className='px-2 py-1 hover:bg-slate-200 text-2xl text-fontColor rounded-md'>
                    <BsThreeDotsVertical />
                  </button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => setOpenModal(true)}
                  >
                    Update
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </div>
          <p className="text-fontColor text-base pl-6 mt-3 font-normal w-full">
            {coursesList[0]?.description || 'En business, c’est mieux d’être accompagné que d’être seul !'}
          </p>

          <div className='max-w-[500px] w-[90%] mx-auto flex flex-col justify-center items-center mt-2 gap-2'>
            <div className='w-full h-full aspect-video relative '>
              {coursesListLoading ? (
                <Skeleton className='h-full w-full' h={'100%'} />) :
                isVideoPlay ? (
                  <VimeoCustomPlayer url={coursesList[0]?.video} />
                ) : (
                  <>
                    <img src={coursesList[0]?.thumbnail ? filePath + coursesList[0]?.thumbnail : coursesImage} className='!h-full aspect-video !w-full' />
                    <Button
                      color={'#38b6ff'}
                      className="max-w-16 !size-5 !text-[8px] md:!size-10 !p-0 md:!text-xl !absolute !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%] z-[1]"
                      radius={'xl'}
                      onClick={() => setIsVIdeoPlay(true)}
                    >
                      <FaPlay />
                    </Button>
                  </>
                )}


            </div>
            <Button onClick={() => navigate('/dashboard/plans/list')} variant='filled' className='w-fit' color={'#ff6d3f'}>
              Rejoindre la communauté
            </Button>
          </div>
        </Grid.Col>
      </Grid>
    </>
  )
}

const CourseSkeleton = () => {
  return (
    <>
      <Grid.Col span={{ base: 12, md: 6, xl: 4 }} className="px-4 md:!px-8">
        <Skeleton width={180} height={20} mt={6} radius="lg" />
        <Skeleton height={200} mt={6} radius="sm" />
        <Skeleton height={40} mt={6} radius="lg" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, xl: 4 }} className="px-4 md:!px-8">
        <Skeleton width={180} height={20} mt={6} radius="lg" />
        <Skeleton height={200} mt={6} radius="sm" />
        <Skeleton height={40} mt={6} radius="lg" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, xl: 4 }} className="px-4 md:!px-8">
        <Skeleton width={180} height={20} mt={6} radius="lg" />
        <Skeleton height={200} mt={6} radius="sm" />
        <Skeleton height={40} mt={6} radius="lg" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, xl: 4 }} className="px-4 md:!px-8">
        <Skeleton width={180} height={20} mt={6} radius="lg" />
        <Skeleton height={200} mt={6} radius="sm" />
        <Skeleton height={40} mt={6} radius="lg" />
      </Grid.Col>
    </>
  );
};

export default CoursesLists;
