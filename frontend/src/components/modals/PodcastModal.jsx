import {
  Button,
  Image,
  Modal,
  Select,
  TextInput,
  SimpleGrid,
  Text,
  Flex,
  Textarea,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  AuDepart,
  employeeRanges,
  podcastNiche,
  podcastType,
  revenueRanges,
} from "../../data/data";
import { IoIosLink } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AddEditPodcasts } from "../../redux/actions/podcastsActions";
import { successMessage, warningMessage } from "../../services/helpers";
import { uploadFileInChunks } from "../../services/helpers/uploader";
import { parseRange } from "../../services/helpers/Splitter";

const PodcastModal = ({
  data = null,
  openModal,
  setOpenModal,
  activeSection = null,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const { podcastsList, podcastAddLoading } = useSelector(
    (state) => state?.podcasts
  );
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      enterpreneur: "",
      title: "",
      type: "",
      niche: "",
      revenue: "",
      periodicity: "",
      au_depart: "",
      employees: "",
      idStory: `Story${podcastsList.length}`,
      pictureName: null,
      picture:
        "",
      binaryPicture: null,
      podcast: "",
      section1: {
        title: "",
        content: "",
        image: "",
        binaryImage: null,
        imageName: null,
      },
      section2: {
        title: "",
        content: "",
        image: "",
        binaryImage: null,
        imageName: null,
      },
      section3: {
        title: "",
        content: "",
        image: "",
        binaryImage: null,
        imageName: null,
      },
      section4: {
        title: "",
        content: "",
        image: "",
        binaryImage: null,
        imageName: null,
      },
      section5: {
        title: "",
        content: "",
        image: "",
        binaryImage: null,
        imageName: null,
      },
      section6: {
        title: "",
        content: "",
        image: "",
        binaryImage: null,
        imageName: null,
      },
    },
    validate: {
      enterpreneur: (value) => {
        console.log('value ', value);
        if (value.length == 0 && activeStep === 1) {
          return "Entrepreneur name is required!";
        }
        return null;
      },
      title: (value) => {
        if (value.length == 0 && activeStep === 1) {
          return "Title is required!";
        }
        return null;
      },
      revenue: (value) => {
        return value.length == 0 && activeStep === 1 ? "Revenue is required!" : null;
      },
      periodicity: (value) => { return value.length == 0 && activeStep === 1 ? "This field is required!" : null },
      type: (value) => { return value.length == 0 && activeStep === 1 ? "This field is required!" : null },
      niche: (value) => { return value.length == 0 && activeStep === 1 ? "This field is required!" : null },
      au_depart: (value) => { return value.length == 0 && activeStep === 1 ? "This field is required!" : null },
      employees: (value) => { return value.length == 0 && activeStep === 1 ? "This field is required!" : null },
      podcast: (value) => { return value.length == 0 && activeStep === 1 ? "This field is required!" : null },
      section1: {
        title: (value) => {
          if (activeStep == 2 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        content: (value) => {
          if (activeStep == 2 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        imageName: (value) => {
          if (activeStep == 2 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
      },
      section2: {
        title: (value) => {
          if (activeStep == 3 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        content: (value) => {
          if (activeStep == 3 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        imageName: (value) => {
          if (activeStep == 3 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
      },
      section3: {
        title: (value) => {
          if (activeStep == 4 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        content: (value) => {
          if (activeStep == 4 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        imageName: (value) => {
          if (activeStep == 4 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
      },
      section4: {
        title: (value) => {
          if (activeStep == 5 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        content: (value) => {
          if (activeStep == 5 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        imageName: (value) => {
          if (activeStep == 5 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
      },
      section5: {
        title: (value) => {
          if (activeStep == 6 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        content: (value) => {
          if (activeStep == 6 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        imageName: (value) => {
          if (activeStep == 6 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
      },
      section6: {
        title: (value) => {
          if (activeStep == 7 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        content: (value) => {
          if (activeStep == 7 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
        imageName: (value) => {
          if (activeStep == 7 && value.length == 0) {
            return "Field is required!";
          }
          return null;
        },
      },
    }
  });

  const handleSubmit = async (values) => {
    try {
      console.log("form.values ", form.values);
      let EntrepreneurimageLink = form.values.picture;
      if (!form.values?._id && !form.values.binaryPicture) {
        form.setErrors({ imageLink: "Image is required!" });
        return;
      }
      if (form.values.binaryPicture) {
        let ImageResp = await uploadFileInChunks(form.values.binaryPicture);
        if (ImageResp?.data?.success) {
          form.setValues({ picture: ImageResp?.data?.data?.link });
          EntrepreneurimageLink = ImageResp?.data?.data?.link;
        } else {
          warningMessage("Failed to upload file");
          return;
        }
      }

      // Helper function for handling image uploads
      const handleImageUpload = async (section, key) => {
        let imageLink = section.image;
        if (!form.values?._id && !section.binaryImage) {
          form.setErrors({ imageLink: "Image is required!" });
          return null;
        }
        if (section.binaryImage) {
          const ImageResp = await uploadFileInChunks(section.binaryImage);
          if (ImageResp?.data?.success) {
            form.setValues({
              [key]: { ...section, image: ImageResp?.data?.data?.link },
            });
            imageLink = ImageResp?.data?.data?.link;
          } else {
            warningMessage("Failed to upload file");
            return null;
          }
        }
        return imageLink;
      };

      // Process all images
      let sectionImageLinks = [];
      if (activeStep > 1) {
        sectionImageLinks = await Promise.all(
          Array.from({ length: 6 }, (_, i) =>
            handleImageUpload(form.values[`section${i + 1}`], `section${i + 1}`)
          )
        );
        if (sectionImageLinks.includes(null)) return;
      }

      // Parse ranges
      const au_departs = parseRange(form.values.au_depart);
      const revenue = parseRange(form.values.revenue);
      const employees = parseRange(form.values.employees);

      // Dispatch the action
      const resp = await dispatch(
        AddEditPodcasts({
          ...form.values,
          revenueFrom: revenue.from,
          revenueTo: revenue.to,
          au_departFrom: au_departs.from,
          au_departTo: au_departs.to,
          employeesFrom: employees.from,
          employeesTo: employees.to,
          picture: EntrepreneurimageLink,
          ...Object.fromEntries(
            sectionImageLinks.map((link, index) => [
              `section${index + 1}`,
              {
                ...form.values[`section${index + 1}`],
                image: link,
                content: form.values[`section${index + 1}`]?.content || "",
                title: form.values[`section${index + 1}`]?.title || "",
              },
            ])
          ),
        })
      );

      if (resp.success) {
        if (activeStep == 1) {
          console.log('resp.data ', resp.data)
          handleSetValue(resp.data)
        }
        if (activeStep > 6) {
          setOpenModal(false);
          setActiveStep(1);
        } else {
          setActiveStep(activeStep + 1);
        }
        // } else {
        successMessage(`Podcast ${form.values?._id ? "updated" : "added"}!`);
        // }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (data?._id) {
      handleSetValue(data)
    } else {
      form.setValues({ idStory: `Story${podcastsList.length + 1}` });
    }
  }, [data, podcastsList]);

  useEffect(() => {
    if (activeSection) {
      let number = parseInt(activeSection.replace("section", ""));
      if (number > 0) {
        setActiveStep(number + 1);
      }
    }
  }, [activeSection]);

  const handleSetValue = (data) => {
    try {
      const extractImageName = (url) => url?.split("/")?.pop() || "";
      form.setValues({
        ...data,
        pictureName: extractImageName(data.picture),
        ...Object.fromEntries(
          Array.from({ length: 6 }, (_, i) => [
            `section${i + 1}`,
            {
              ...data[`section${i + 1}`],
              imageName: extractImageName(data[`section${i + 1}`]?.image),
            },
          ])
        ),
      });
      console.log('values set successfull')
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal
      centered
      size={"lg"}
      classNames={{ body: "!pt-0" }}
      opened={openModal}
      onClose={() => setOpenModal(false)}
      withCloseButton={false}
    >
      <div className="relative">
        <div className="flex justify-center items-center py-4 w-full sticky top-0 bg-white z-[2]">
          <h4 className="text-center text-[#38b6ff] font-semibold text-2xl">
            {activeStep == 1
              ? "Podcast Information"
              : activeStep == 2
                ? "Introduction"
                : activeStep == 3
                  ? "L'idée"
                  : activeStep == 4
                    ? "Le lancement"
                    : activeStep == 5
                      ? "La croissance"
                      : activeStep == 6
                        ? "Les revenues"
                        : "A retenir"}
          </h4>
          <Button
            variant="subtle"
            className="!absolute !right-0 !top-3 z-10"
            onClick={() => setOpenModal(false)}
          >
            <FaXmark />
          </Button>
        </div>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          {activeStep == 1 ? (
            <div className="py-3 relative">
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Entrepreneur
                </label>
                <TextInput
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  radius="xl"
                  placeholder="Name of the entrepreneur"
                  {...form.getInputProps("enterpreneur")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Titre
                </label>
                <TextInput
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  radius="xl"
                  placeholder="Title of the story"
                  {...form.getInputProps("title")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Type
                </label>
                <div className="w-full md:w-9/12 flex gap-3">
                  <Select
                    data={podcastType}
                    className=" !rounded-full"
                    placeholder="Type"
                    variant="filled"
                    radius="xl"
                    {...form.getInputProps("type")}
                  />

                  <Select
                    data={podcastNiche}
                    className=" !rounded-full"
                    variant="filled"
                    radius="xl"
                    placeholder="Niche"
                    {...form.getInputProps("niche")}
                  />
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Revenue
                </label>
                <div className="w-full md:w-9/12 flex gap-3">
                  <Select
                    data={revenueRanges}
                    className=" !rounded-full"
                    variant="filled"
                    radius="xl"
                    placeholder="Revenue"
                    {...form.getInputProps("revenue")}
                  />

                  <Select
                    data={["revenue / mois", "revenue / an"]}
                    className=" !rounded-full"
                    variant="filled"
                    radius="xl"
                    placeholder="Periodicity"
                    {...form.getInputProps("periodicity")}
                  />
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Au départ
                </label>
                <div className="w-full md:w-9/12 flex gap-3">
                  <Select
                    data={AuDepart}
                    className=" !rounded-full"
                    variant="filled"
                    radius="xl"
                    placeholder="AU depart"
                    {...form.getInputProps("au_depart")}
                  />

                  <Select
                    data={employeeRanges}
                    className=" !rounded-full"
                    variant="filled"
                    radius="xl"
                    placeholder="Employees"
                    {...form.getInputProps("employees")}
                  />
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Entrepreneur Photo
                </label>
                <div className="w-full md:w-9/12 flex gap-3 flex-col">
                  {!form.values.pictureName ? (
                    <Dropzone
                      multiple={false}
                      accept={IMAGE_MIME_TYPE}
                      onDrop={(e) =>
                        form.setValues({
                          binaryPicture: e[0],
                          pictureName: e[0].name,
                        })
                      }
                    >
                      <Text ta="center">Drop images here</Text>
                    </Dropzone>
                  ) : (
                    <Flex className="w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md">
                      <p className="text-sm text-fontColor">
                        {form.values.pictureName}
                      </p>
                      <Button
                        onClick={() =>
                          form.setValues({
                            binaryPicture: null,
                            pictureName: null,
                          })
                        }
                        variant="subtle"
                        color="orange"
                        size="xs"
                      >
                        Change
                      </Button>
                    </Flex>
                  )}
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Podcast
                </label>
                <div className="w-full md:w-9/12 flex gap-3 flex-col">
                  <TextInput
                    variant="filled"
                    className="w-full !rounded-full"
                    radius="xl"
                    placeholder="URL of the Podcast"
                    {...form.getInputProps("podcast")}
                    leftSection={<IoIosLink />}
                  />
                </div>
              </div>
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  ID Story
                </label>
                <div className="w-full md:w-9/12 flex gap-3">
                  <p>{form.values.idStory}</p>
                </div>
              </div>
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor"></label>
                <div className="w-full md:w-9/12 flex gap-5 justify-center ">
                  <Button variant="subtle" type="button" color="orange">
                    Supprimer
                  </Button>
                  <Button variant="filled" type="submit" color={"#38b6ff"}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          ) : activeStep == 2 ? (
            <div className="py-3 relative">
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Titre
                </label>
                <TextInput
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  radius="xl"
                  placeholder="Title of the idea (100 Cara)"
                  {...form.getInputProps("section1.title")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Contenu du paragraphe
                </label>
                <Textarea
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  autosize
                  minRows={6}
                  radius="xl"
                  placeholder="Description of Section 1"
                  {...form.getInputProps("section1.content")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Image
                </label>
                <div className="w-full md:w-9/12 flex gap-3 flex-col">
                  {!form.values.section1.imageName ? (
                    <div>
                      <Dropzone
                        multiple={false}
                        accept={IMAGE_MIME_TYPE}
                        onDrop={(e) =>
                          form.setValues({
                            section1: {
                              ...form.values.section1,
                              binaryImage: e[0],
                              imageName: e[0].name,
                            },
                          })
                        }
                      >
                        <Text ta="center">Drop images here</Text>
                      </Dropzone>
                      <p className="text-red-500 text-xs mt-0.5">{form.errors['section1.imageName']}</p>
                    </div>
                  ) : (
                    <Flex className="w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md">
                      <p className="text-sm text-fontColor">
                        {form.values.section1.imageName}
                      </p>
                      <Button
                        onClick={() =>
                          form.setValues({
                            section1: {
                              ...form.values.section1,
                              binaryImage: null,
                              imageName: null,
                            },
                          })
                        }
                        variant="subtle"
                        color="orange"
                        size="xs"
                      >
                        Change
                      </Button>
                    </Flex>
                  )}
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor"></label>
                <div className="w-full md:w-9/12 flex gap-5 justify-center ">
                  <Button
                    className="!w-5/12"
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="subtle"
                    color="orange"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="!w-5/12"
                    variant="filled"
                    color={"#38b6ff"}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : activeStep == 3 ? (
            <div className="py-3">
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Titre
                </label>
                <TextInput
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  radius="xl"
                  placeholder="Title of the idea (100 Cara)"
                  {...form.getInputProps("section2.title")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Contenu du paragraphe
                </label>
                <Textarea
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  autosize
                  minRows={6}
                  radius="xl"
                  placeholder="Description of Section 2"
                  {...form.getInputProps("section2.content")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Image
                </label>
                <div className="w-full md:w-9/12 flex gap-3 flex-col">
                  {!form.values.section2.imageName ? (
                    <div>
                      <Dropzone
                        multiple={false}
                        accept={IMAGE_MIME_TYPE}
                        onDrop={(e) =>
                          form.setValues({
                            section2: {
                              ...form.values.section2,
                              binaryImage: e[0],
                              imageName: e[0].name,
                            },
                          })
                        }
                      >
                        <Text ta="center">Drop images here</Text>
                      </Dropzone>
                      <p className="text-red-500 text-xs mt-0.5">{form.errors['section2.imageName']}</p>
                    </div>
                  ) : (
                    <Flex className="w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md">
                      <p className="text-sm text-fontColor">
                        {form.values.section2.imageName}
                      </p>
                      <Button
                        onClick={() =>
                          form.setValues({
                            section2: {
                              ...form.values.section2,
                              binaryImage: null,
                              imageName: null,
                            },
                          })
                        }
                        variant="subtle"
                        color="orange"
                        size="xs"
                      >
                        Change
                      </Button>
                    </Flex>
                  )}
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor"></label>
                <div className="w-full md:w-9/12 flex gap-5 justify-center ">
                  <Button
                    className="!w-5/12"
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="subtle"
                    color="orange"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="!w-5/12"
                    variant="filled"
                    color={"#38b6ff"}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : activeStep == 4 ? (
            <div className="py-3">
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Titre
                </label>
                <TextInput
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  radius="xl"
                  placeholder="Title of the idea (100 Cara)"
                  {...form.getInputProps("section3.title")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Contenu du paragraphe
                </label>
                <Textarea
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  autosize
                  minRows={6}
                  radius="xl"
                  placeholder="Description of Section 3"
                  {...form.getInputProps("section3.content")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Image
                </label>
                <div className="w-full md:w-9/12 flex gap-3 flex-col">
                  {!form.values.section3.imageName ? (
                    <div>
                      <Dropzone
                        multiple={false}
                        accept={IMAGE_MIME_TYPE}
                        onDrop={(e) =>
                          form.setValues({
                            section3: {
                              ...form.values.section3,
                              binaryImage: e[0],
                              imageName: e[0].name,
                            },
                          })
                        }
                      >
                        <Text ta="center">Drop images here</Text>
                      </Dropzone>
                      <p className="text-red-500 text-xs mt-0.5">{form.errors['section3.imageName']}</p>
                    </div>
                  ) : (
                    <Flex className="w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md">
                      <p className="text-sm text-fontColor">
                        {form.values.section3.imageName}
                      </p>
                      <Button
                        onClick={() =>
                          form.setValues({
                            section3: {
                              ...form.values.section3,
                              binaryImage: null,
                              imageName: null,
                            },
                          })
                        }
                        variant="subtle"
                        color="orange"
                        size="xs"
                      >
                        Change
                      </Button>
                    </Flex>
                  )}
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor"></label>
                <div className="w-full md:w-9/12 flex gap-5 justify-center ">
                  <Button
                    className="!w-5/12"
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="subtle"
                    color="orange"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="!w-5/12"
                    variant="filled"
                    color={"#38b6ff"}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : activeStep == 5 ? (
            <div className="py-3">
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Titre
                </label>
                <TextInput
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  radius="xl"
                  placeholder="Title of the idea (100 Cara)"
                  {...form.getInputProps("section4.title")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Contenu du paragraphe
                </label>
                <Textarea
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  autosize
                  minRows={6}
                  radius="xl"
                  placeholder="Description of Section 4"
                  {...form.getInputProps("section4.content")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Image
                </label>
                <div className="w-full md:w-9/12 flex gap-3 flex-col">
                  {!form.values.section4.imageName ? (
                    <div>
                      <Dropzone
                        multiple={false}
                        accept={IMAGE_MIME_TYPE}
                        onDrop={(e) =>
                          form.setValues({
                            section4: {
                              ...form.values.section4,
                              binaryImage: e[0],
                              imageName: e[0].name,
                            },
                          })
                        }
                      >
                        <Text ta="center">Drop images here</Text>
                      </Dropzone>
                      <p className="text-red-500 text-xs mt-0.5">{form.errors['section4.imageName']}</p>
                    </div>
                  ) : (
                    <Flex className="w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md">
                      <p className="text-sm text-fontColor">
                        {form.values.section4.imageName}
                      </p>
                      <Button
                        onClick={() =>
                          form.setValues({
                            section4: {
                              ...form.values.section4,
                              binaryImage: null,
                              imageName: null,
                            },
                          })
                        }
                        variant="subtle"
                        color="orange"
                        size="xs"
                      >
                        Change
                      </Button>
                    </Flex>
                  )}
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor"></label>
                <div className="w-full md:w-9/12 flex gap-5 justify-center ">
                  <Button
                    className="!w-5/12"
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="subtle"
                    color="orange"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="!w-5/12"
                    variant="filled"
                    color={"#38b6ff"}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : activeStep == 6 ? (
            <div className="py-3">
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Titre
                </label>
                <TextInput
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  radius="xl"
                  placeholder="Title of the idea (100 Cara)"
                  {...form.getInputProps("section5.title")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Contenu du paragraphe
                </label>
                <Textarea
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  autosize
                  minRows={6}
                  radius="xl"
                  placeholder="Description of Section 5"
                  {...form.getInputProps("section5.content")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Image
                </label>
                <div className="w-full md:w-9/12 flex gap-3 flex-col">
                  {!form.values.section5.imageName ? (
                    <div>
                      <Dropzone
                        multiple={false}
                        accept={IMAGE_MIME_TYPE}
                        onDrop={(e) =>
                          form.setValues({
                            section5: {
                              ...form.values.section5,
                              binaryImage: e[0],
                              imageName: e[0].name,
                            },
                          })
                        }
                      >
                        <Text ta="center">Drop images here</Text>
                      </Dropzone>
                      <p className="text-red-500 text-xs mt-0.5">{form.errors['section5.imageName']}</p>
                    </div>
                  ) : (
                    <Flex className="w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md">
                      <p className="text-sm text-fontColor">
                        {form.values.section5.imageName}
                      </p>
                      <Button
                        onClick={() =>
                          form.setValues({
                            section5: {
                              ...form.values.section5,
                              binaryImage: null,
                              imageName: null,
                            },
                          })
                        }
                        variant="subtle"
                        color="orange"
                        size="xs"
                      >
                        Change
                      </Button>
                    </Flex>
                  )}
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor"></label>
                <div className="w-full md:w-9/12 flex gap-5 justify-center ">
                  <Button
                    className="!w-5/12"
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="subtle"
                    color="orange"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="!w-5/12"
                    variant="filled"
                    color={"#38b6ff"}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-3">
              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Titre
                </label>
                <TextInput
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  radius="xl"
                  placeholder="Title of the idea (100 Cara)"
                  {...form.getInputProps("section6.title")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Contenu du paragraphe
                </label>
                <Textarea
                  variant="filled"
                  className="w-full md:w-9/12 !rounded-full"
                  autosize
                  minRows={6}
                  radius="xl"
                  placeholder="Description of Section 6"
                  {...form.getInputProps("section6.content")}
                />
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor">
                  Image
                </label>
                <div className="w-full md:w-9/12 flex gap-3 flex-col">
                  {!form.values.section6.imageName ? (
                    <div>
                      <Dropzone
                        multiple={false}
                        accept={IMAGE_MIME_TYPE}
                        onDrop={(e) =>
                          form.setValues({
                            section6: {
                              ...form.values.section6,
                              binaryImage: e[0],
                              imageName: e[0].name,
                            },
                          })
                        }
                      >
                        <Text ta="center">Drop images here</Text>
                      </Dropzone>
                      <p className="text-red-500 text-xs mt-0.5">{form.errors['section6.imageName']}</p>
                    </div>
                  ) : (
                    <Flex className="w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md">
                      <p className="text-sm text-fontColor">
                        {form.values.section6.imageName}
                      </p>
                      <Button
                        onClick={() =>
                          form.setValues({
                            section6: {
                              ...form.values.section6,
                              binaryImage: null,
                              imageName: null,
                            },
                          })
                        }
                        variant="subtle"
                        color="orange"
                        size="xs"
                      >
                        Change
                      </Button>
                    </Flex>
                  )}
                </div>
              </div>

              <div className="flex md:flex-nowrap flex-wrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2">
                <label className="w-full md:w-3/12 font-normal text-sm md:text-base text-fontColor"></label>
                <div className="w-full md:w-9/12 flex gap-5 justify-center ">
                  <Button
                    className="!w-5/12"
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="subtle"
                    color="orange"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    loading={podcastAddLoading}
                    className="!w-5/12"
                    variant="filled"
                    color={"#38b6ff"}
                  >
                    {activeStep == 7 ? "Submit" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
};

export default PodcastModal;
