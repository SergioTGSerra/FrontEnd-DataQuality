<template>
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
            placeholder="Search Metrics"
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
          data-kt-metric-table-toolbar="base"
        >
          <!--begin::Export-->
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_metrics_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button>
          <!--end::Export-->
          <!--begin::Add metric-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_metric"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Metric
          </button>
          <!--end::Add metric-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-metric-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewMetrics()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-metric-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-metric-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-metric-table-select="delete_selected"
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
        <template v-slot:name="{ row: metric }">
          {{ metric.name }}
        </template>
        <template v-slot:description="{ row: metric }">
          {{ metric.description }}
        </template>
        <template v-slot:unit="{ row: metric }">
          {{ metric.unit }}
        </template>
        <template v-slot:actions="{ row: metric }">
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
                @click="editMetric(metric)"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_edit_metric"
                class="menu-link px-3"
                >Edit</a
              >
                            
            </div>
            <!--end::Menu item-->
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a @click="deleteMetric(metric.id)" class="menu-link px-3"
                >Delete</a
              >
            </div>
            <!--end::Menu item-->
          </div>
          <!--end::Menu-->
        </template>
      </Datatable>
    </div>
  </div>

  <ExportMetricModal></ExportMetricModal>
  <AddMetricModal :tableData="tableData"></AddMetricModal>
  <EditMetricModal :metric="metric" :tableData="tableData"></EditMetricModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import ExportMetricModal from "@/components/modals/forms/ExportMetricModal.vue";
import AddMetricModal from "@/views/apps/metrics/AddMetricModal.vue";
import EditMetricModal from "./EditMetricModal.vue";
import type { IMetric } from "@/core/data/metrics";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const response = await ApiService.get("/metric");

if(response.status === 401) authStore.refreshToken();

const metrics = response.data.data;
const totalItems = response.data.totalElements; 

export default defineComponent({
  name: "metrics-listing",
  components: {
    Datatable,
    ExportMetricModal,
    AddMetricModal,
    EditMetricModal,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Name",
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Description",
        columnLabel: "description",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Unit",
        columnLabel: "unit",
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
    const tableData = ref<Array<IMetric>>(metrics? metrics : []);
    const metric = ref<Object>([]);
    const initMetrics = ref<Array<IMetric>>([]);
    let current_page = ref<number>(0);
    let items_per_page = ref<number>(10);

    onMounted(() => {
      initMetrics.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const getMetrics = async (current_page_param: number, items_per_page_param: number) => {
      if(items_per_page.value !== items_per_page_param){
        const response = await ApiService.get("metric?page=0&items_per_page=" + items_per_page_param);
        tableData.value = response.data.data;
      }else{
        const response = await ApiService.get("metric?page=" + current_page_param + "&items_per_page=" + items_per_page_param);
        tableData.value = response.data.data;
      }
    };

    const currentPage = (page: any) => {
      page = page - 1;
      getMetrics(page, items_per_page.value);
      current_page.value = page;
    };

    const itemsPerPage = (items: any) => {
      getMetrics(current_page.value, items);
      items_per_page.value = items;
    };

    const editMetric = (metricI: IMetric) => {
      metric.value = metricI;
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
                ApiService.delete(`/metric/${item}`);
                tableData.value = tableData.value.filter((metric) => metric.id !== item.toString());
              });
              selectedIds.value.length = 0;
            }else{
              ApiService.delete(`/metric/${id}`);
              tableData.value = tableData.value.filter((metric) => metric.id !== id.toString());
            }
            Swal.fire("Deleted!", "Your files have been deleted.", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelled", "Your files are safe :)", "error");
          }
        });
    }

    const deleteFewMetrics = () => {
      deleteModalConfirmation();
    };

    const deleteMetric = (id: number) => {
      deleteModalConfirmation(id);
    };

    const search = ref<string>("");
    const searchItems = () => {
      tableData.value.splice(0, tableData.value.length, ...initMetrics.value);
      if (search.value !== "") {
        let results: Array<IMetric> = [];
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
      deleteMetric,
      search,
      searchItems,
      selectedIds,
      deleteFewMetrics,
      sort,
      onItemSelect,
      editMetric,
      metric,
      currentPage,
      itemsPerPage,
      totalItems,
    };
  },
});
</script>