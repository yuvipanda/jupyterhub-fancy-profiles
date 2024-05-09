import "@testing-library/jest-dom";

window.profileList = [
  {
    slug: "small",
    display_name: "Small",
    description: "~2 CPU, ~2G RAM",
    profile_options: {
      image: {
        display_name: "Image",
        unlisted_choice: {
          enabled: true,
          display_name: "Custom image",
          validation_regex: "^.+:.+$",
          validation_message:
            "Must be a publicly available docker image, of form <image-name>:<tag>",
          display_name_in_choices: "Specify an existing docker image",
          description_in_choices:
            "Use a pre-existing docker image from a public docker registry",
          kubespawner_override: { image: "{value}" },
        },
        choices: {
          pangeo: {
            display_name: "Pangeo Notebook Image",
            description:
              "Python image with scientific, dask and geospatial tools",
            kubespawner_override: {
              image: "pangeo/pangeo-notebook:2023.09.11",
            },
          },
          geospatial: {
            display_name: "Rocker Geospatial",
            description:
              "R image with RStudio, the tidyverse & Geospatial tools",
            default: true,
            slug: "geospatial",
            kubespawner_override: {
              image: "rocker/binder:4.3",
              default_url: "/rstudio",
              working_dir: "/home/rstudio",
            },
          },
          scipy: {
            display_name: "Jupyter SciPy Notebook",
            slug: "scipy",
            kubespawner_override: {
              image: "jupyter/scipy-notebook:2023-06-26",
            },
          },
        },
      },
      resources: {
        display_name: "Resource Allocation",
        choices: {
          mem_2_7: {
            display_name: "2.7 GB RAM, upto 3.479 CPUs",
            description: "Use this for the workshop on 2023 September",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 2904451072,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
            default: true,
          },
          mem_5_4: {
            display_name: "5.4 GB RAM, upto 3.479 CPUs",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 5808902144,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
          },
          mem_10_8: {
            display_name: "10.8 GB RAM, upto 3.479 CPUs",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 11617804288,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
          },
          mem_21_6: {
            display_name: "21.6 GB RAM, upto 3.479 CPUs",
            description: "Large amount of RAM, might start slowly",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 23235608576,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
          },
        },
      },
    },
  },
  {
    slug: "big",
    display_name: "Big",
    description: "~16 CPU, ~512G RAM",
    profile_options: {
      image: {
        display_name: "Image - Big",
        choices: {
          pangeo: {
            display_name: "Pangeo Notebook Image",
            description:
              "Python image with scientific, dask and geospatial tools",
            kubespawner_override: {
              image: "pangeo/pangeo-notebook:2023.09.11",
            },
          },
          geospatial: {
            display_name: "Rocker Geospatial",
            description:
              "R image with RStudio, the tidyverse & Geospatial tools",
            default: true,
            slug: "geospatial",
            kubespawner_override: {
              image: "rocker/binder:4.3",
              default_url: "/rstudio",
              working_dir: "/home/rstudio",
            },
          },
          scipy: {
            display_name: "Jupyter SciPy Notebook",
            slug: "scipy",
            kubespawner_override: {
              image: "jupyter/scipy-notebook:2023-06-26",
            },
          },
        },
      },
      resources: {
        display_name: "Resource Allocation - Big",
        choices: {
          mem_2_7: {
            display_name: "3.7 GB RAM, upto 4.479 CPUs",
            description: "Use this for the workshop on 2023 September",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 2904451072,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
            default: true,
          },
          mem_5_4: {
            display_name: "8.4 GB RAM, upto 3.479 CPUs",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 5808902144,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
          },
        },
      },
    },
  },
];