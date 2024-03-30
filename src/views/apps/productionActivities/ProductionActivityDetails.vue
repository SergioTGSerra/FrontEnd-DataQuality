<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-xl-row">
    <!--begin::Sidebar-->
    <div class="flex-column flex-lg-row-auto w-100 w-xl-350px mb-10">
      <!--begin::Card-->
      <div class="card mb-5 mb-xl-8">
        <!--begin::Card body-->
        <div class="card-body pt-15">
          <!--begin::Summary-->
          <div class="d-flex flex-center flex-column mb-5">
            <!--begin::Avatar-->
            <div class="symbol symbol-100px symbol-circle mb-7">
              <img :src="getAssetPath('media/logos/logo-small.png')" alt="image" />
            </div>
            <!--end::Avatar-->

            <!--begin::Name-->
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              {{ productionActivity.name }}
            </a>
            <!--end::Name-->

            <!--begin::Position-->
            <div class="fs-5 fw-semibold text-muted mb-6">{{ productionActivity.reference }}</div>
            <!--end::Position-->
          </div>
          <!--end::Summary-->

          <!--begin::Details toggle-->
          <div class="d-flex flex-stack fs-4 py-3">
            <div
              class="fw-bold rotate collapsible"
              data-bs-toggle="collapse"
              href="#kt_productionActivityMetric_view_details"
              role="button"
              aria-expanded="false"
              aria-controls="kt_productionActivityMetric_view_details"
            >
              Details
              <span class="ms-2 rotate-180">
                <KTIcon icon-name="down" icon-class="fs-3" />
              </span>
            </div>

            <span
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              title="Edit productionActivityMetric details"
            >
              <a
                href="#"
                @click="editProductionActivity(productionActivity)"
                class="btn btn-sm btn-light-primary"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_edit_productionActivity"
              >
                Edit
              </a>
            </span>
          </div>
          <!--end::Details toggle-->

          <div class="separator separator-dashed my-3"></div>

          <!--begin::Details content-->
          <div id="kt_productionActivityMetric_view_details" class="collapse show">
            <div class="py-5 fs-6">
              <!--begin::Details item-->
              <div class="fw-bold">Name</div>
              <div class="text-gray-600">{{ productionActivity.name }}</div>
              <!--begin::Details item-->
              <!--begin::Details item-->
              <div class="fw-bold mt-5">Reference</div>
              <div class="text-gray-600">{{ productionActivity.reference }}</div>
              <!--begin::Details item-->
            </div>
          </div>
          <!--end::Details content-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
    <!--end::Sidebar-->

    <!--begin::Content-->
    <div class="flex-lg-row-fluid ms-lg-15">
      <!--begin:::Tabs-->
      <ul
        class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8"
      >
        <!--begin:::Tab item-->
        <li class="nav-item">
          <a
            class="nav-link text-active-primary pb-4 active"
            data-bs-toggle="tab"
            >Metrics</a
          >
        </li>
        <!--end:::Tab item-->
      </ul>
      <!--end:::Tabs-->

      <!--begin:::Tab content-->
      <div class="tab-content" id="myTabContent">
        <div class="card">
          <div class="card-header border-0 pt-6">
            <!--begin::Card title-->
            <div class="card-title">
              <!--begin::Search-->
              <div class="d-flex align-items-center position-relative my-1">
                <KTIcon
                  icon-name="magnifier"
                  icon-class="fs-1 position-absolute ms-6"
                />
                <input
                  type="text"
                  v-model="search"
                  @input="searchItems()"
                  class="form-control form-control-solid w-250px ps-15"
                  placeholder="Search Production Activity"
                />
              </div>
              <!--end::Search-->
            </div>
            <!--begin::Card title-->
            <!--begin::Card toolbar-->
            <div class="card-toolbar">
              <!--begin::Toolbar-->
              <div
                v-if="selectedIds.length === 0"
                class="d-flex justify-content-end"
                data-kt-productionActivityMetric-table-toolbar="base"
              >
                <!--begin::Add productionActivityMetric-->
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_associate_productionActivity"
                >
                  <KTIcon icon-name="plus" icon-class="fs-2" />
                  Associate Metric To Production Activity
                </button>
                <!--end::Add productionActivityMetric-->
              </div>
              <!--end::Toolbar-->
              <!--begin::Group actions-->
              <div
                v-else
                class="d-flex justify-content-end align-items-center"
                data-kt-productionActivityMetric-table-toolbar="selected"
              >
                <div class="fw-bold me-5">
                  <span class="me-2">{{ selectedIds.length }}</span
                  >Selected
                </div>
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="deleteFewProductionActivities()"
                >
                  Delete Selected
                </button>
              </div>
              <!--end::Group actions-->
              <!--begin::Group actions-->
              <div
                class="d-flex justify-content-end align-items-center d-none"
                data-kt-productionActivityMetric-table-toolbar="selected"
              >
                <div class="fw-bold me-5">
                  <span
                    class="me-2"
                    data-kt-productionActivityMetric-table-select="selected_count"
                  ></span
                  >Selected
                </div>
                <button
                  type="button"
                  class="btn btn-danger"
                  data-kt-productionActivityMetric-table-select="delete_selected"
                >
                  Delete Selected
                </button>
              </div>
              <!--end::Group actions-->
            </div>
            <!--end::Card toolbar-->
          </div>
          <div class="card-body pt-0">
            <Datatable
              @on-sort="sort"
              @on-items-select="onItemSelect"
              @page-change="currentPage"
              @on-items-per-page-change="itemsPerPage"
              :data="tableData"
              :header="tableHeader"
              :enable-items-per-page-dropdown="true"
              :checkbox-enabled="true"
              checkbox-label="id"
              :totalItems="totalItems"
            >
              <template v-slot:min="{ row: productionActivitiesMetrics }">
                {{ productionActivitiesMetrics.min }}
              </template>
              <template v-slot:max="{ row: productionActivitiesMetrics }">
                {{ productionActivitiesMetrics.max }}
              </template>
              <template v-slot:mean="{ row: productionActivitiesMetrics }">
                {{ productionActivitiesMetrics.mean }}
              </template>
              <template v-slot:k="{ row: productionActivitiesMetrics }">
                {{ productionActivitiesMetrics.k }}
              </template>
              <template v-slot:minDegValid="{ row: productionActivitiesMetrics }">
                {{ productionActivitiesMetrics.minDegValid }}
              </template>
              <template v-slot:minDegSuspect="{ row: productionActivitiesMetrics }">
                {{ productionActivitiesMetrics.minDegSuspect }}
              </template>
              <template v-slot:validationFormula="{ row: productionActivitiesMetrics }">
                {{ productionActivitiesMetrics.validationFormula }}
              </template>
              <template v-slot:metricName="{ row: productionActivitiesMetrics }">
                {{ productionActivitiesMetrics.metric.name }}
              </template>
              <template v-slot:actions="{ row: productionActivitiesMetrics }">
                <a
                  href="#"
                  class="btn btn-sm btn-light btn-active-light-primary"
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                  data-kt-menu-flip="top-end"
                  >Actions
                  <KTIcon icon-name="down" icon-class="fs-5 m-0" />
                </a>
                <!--begin::Menu-->
                <div
                  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                  data-kt-menu="true"
                >

                  <!--begin::Menu item-->
                  <div class="menu-item px-3">
                    <a
                      @click="editProductionActivityMetric(productionActivitiesMetrics)"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_edit_productionActivityMetric"
                      class="menu-link px-3"
                      >
                      <KTIcon icon-name="pencil" icon-class="fs-5 me-3" />
                      Edit
                    </a>              
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item-->
                  <div class="menu-item px-3">
                    <a @click="deleteProductionActivityMetric(productionActivitiesMetrics.metric.id)" class="menu-link px-3"
                      >
                      <KTIcon icon-name="trash" icon-class="fs-5 me-3" />
                      Delete
                    </a>
                  </div>
                  <!--end::Menu item-->
                </div>
                <!--end::Menu-->
              </template>
            </Datatable>
          </div>
        </div>
      </div>
      <!--end:::Tab content-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Layout-->

  <AssociateProductionActivityToMetricModal :tableData="tableData" :productionActivityId="dynamicRouteId"></AssociateProductionActivityToMetricModal>
  <EditProductionActivityModal :productionActivity="productionActivity" :tableData="tableData"></EditProductionActivityModal>
  <EditProductionActivityModalMetric :productionActivitiesMetrics="productionActivitiesMetrics" :productionActivityId="dynamicRouteId" :tableData="tableData"></EditProductionActivityModalMetric>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import AssociateProductionActivityToMetricModal from "./AssociateProductionActivityToMetricModal.vue";
import EditProductionActivityModal from "./EditProductionActivityModal.vue";
import EditProductionActivityModalMetric from "./EditProductionActivityMetricModal.vue";
import type { IProductionActivity } from "@/core/data/productionActivities";
import type { IProductionActivityMetric } from "@/core/data/productionActivitiesMetrics";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "production-activities-details",
  components: {
    Datatable,
    AssociateProductionActivityToMetricModal,
    EditProductionActivityModal,
    EditProductionActivityModalMetric,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Min",
        columnLabel: "min",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Max",
        columnLabel: "max",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Mean",
        columnLabel: "mean",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "K",
        columnLabel: "k",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Min Deg Valid",
        columnLabel: "minDegValid",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Min Deg Suspect",
        columnLabel: "minDegSuspect",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Validation Formula",
        columnLabel: "validationFormula",
        sortEnabled: true,
        columnWidth: 175,
      },  
      {
        columnName: "Metric Name",
        columnLabel: "metricName",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 135,
      },
    ]);
    const selectedIds = ref<Array<number>>([]);
    let productionActivitiesMetrics = ref<any>([]);
    let tableData = ref<Array<any>>([]);
    const productionActivity = ref<any>([]);
    const initProductionActivitiesMetrics = ref<Array<any>>([]);
    let current_page = ref<number>(0);
    let items_per_page = ref<number>(10);
    let totalItems = ref<number>(0);
    const $route = useRoute();
    const dynamicRouteId = $route.params?.id ?? '';
    
    const loadMetrics = async () => {
      try {
        const responseMetrics = await ApiService.get("/production-activity/" + dynamicRouteId);
        productionActivity.value = responseMetrics.data.data;
        totalItems.value = responseMetrics.data.data.metrics.length;
        tableData.value = responseMetrics.data.data.metrics;
        return responseMetrics.data.data.metrics;
      } catch (error) {
        console.error('Erro ao carregar dados da API:', error);
      }
    };

    productionActivitiesMetrics.value.push(loadMetrics());
    
    onMounted(() => {
      initProductionActivitiesMetrics.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const editProductionActivityMetric = (ProductionActivityI: IProductionActivityMetric) => {
      productionActivitiesMetrics.value = ProductionActivityI;
    };

    const editProductionActivity = (ProductionActivityI: IProductionActivity) => {
      productionActivity.value = ProductionActivityI;
    };

    const getProductActivities = async (current_page_param: number, items_per_page_param: number) => {
      if(items_per_page.value !== items_per_page_param){
        const response = await ApiService.get("production-activity?page=0&items_per_page=" + items_per_page_param);
        tableData.value = response.data.data;
      }else{
        const response = await ApiService.get("production-activity?page=" + current_page_param + "&items_per_page=" + items_per_page_param);
        tableData.value = response.data.data;
      }
    };

    const currentPage = (page: any) => {
      page = page - 1;
      getProductActivities(page, items_per_page.value);
      current_page.value = page;
    };

    const itemsPerPage = (items: any) => {
      getProductActivities(current_page.value, items);
      items_per_page.value = items;
    };

    const deleteModalConfirmation = (id?: any) => {
      Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete them all!",
          cancelButtonText: "No, cancel!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-active-light-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {

            if (selectedIds.value.length > 0){
              selectedIds.value.forEach((item) => {
                ApiService.delete(`/production-activity-metric/${item}/${dynamicRouteId}`);
                tableData.value = tableData.value.filter((productionActivityMetric) => productionActivityMetric.metric.id !== item.toString());
              });
              selectedIds.value.length = 0;
            }else{
              ApiService.delete(`/production-activity-metric/${id}/${dynamicRouteId}`);
              tableData.value = tableData.value.filter((productionActivityMetric) => productionActivityMetric.metric.id !== id.toString());
            }
            Swal.fire("Deleted!", "Your files have been deleted.", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelled", "Your files are safe :)", "error");
          }
        });
    }

    const deleteFewProductionActivities = () => {
      deleteModalConfirmation();
    };

    const deleteProductionActivityMetric = (id: number) => {
      deleteModalConfirmation(id);
    };

    const search = ref<string>("");
    const searchItems = () => {
      tableData.value.splice(0, tableData.value.length, ...initProductionActivitiesMetrics.value);
      if (search.value !== "") {
        let results: Array<any> = [];
        for (let j = 0; j < tableData.value.length; j++) {
          if (searchingFunc(tableData.value[j], search.value)) {
            results.push(tableData.value[j]);
          }
        }
        tableData.value.splice(0, tableData.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].indexOf(value) != -1) {
            return true;
          }
        }
      }
      return false;
    };

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(tableData.value, sort.label, { reverse });
      }
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    return {
      tableData,
      tableHeader,
      deleteProductionActivityMetric,
      search,
      searchItems,
      selectedIds,
      deleteFewProductionActivities,
      sort,
      onItemSelect,
      editProductionActivityMetric,
      productionActivity,
      currentPage,
      itemsPerPage,
      getAssetPath,
      totalItems,
      dynamicRouteId,
      editProductionActivity,
      productionActivitiesMetrics
    };
  },
});
</script>
