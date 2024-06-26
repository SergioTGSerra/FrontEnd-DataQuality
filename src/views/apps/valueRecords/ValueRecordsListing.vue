<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <!-- <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            v-model="search"
            @input="searchItems()"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Search Value Records"
          />
        </div> -->
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-valueRecord-table-toolbar="base"
        >
          <!--begin::Export-->
          <!-- <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_valueRecords_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button> -->
          <!--end::Export-->
          <!--begin::Add valueRecord-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_valueRecord"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Value Record
          </button>
          <!--end::Add valueRecord-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-valueRecord-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewValueRecords()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-valueRecord-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-valueRecord-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-valueRecord-table-select="delete_selected"
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
        <template v-slot:value="{ row: valueRecord }">
          {{ valueRecord.value }}
        </template>
        <template v-slot:validityDegree="{ row: valueRecord }">
            {{ valueRecord.validityDegree.toFixed(2) }}%
        </template>
        <template v-slot:validityCategory="{ row: valueRecord }">
          {{ valueRecord.validityCategory }}
        </template>
        <template v-slot:lotReference="{ row: valueRecord }">
          {{ valueRecord.lotReference }}
        </template>
        <template v-slot:metric="{ row: valueRecord }">
          {{ valueRecord.metric.name }}
        </template>
        <template v-slot:productionActivity="{ row: valueRecord }">
          {{ valueRecord.productionActivity.name }}
        </template>
        <template v-slot:organization="{ row: valueRecord }">
          {{ valueRecord.organization.name }}
        </template>
        <template v-slot:actions="{ row: valueRecord }">
          <!--begin::Delete-->
          <a
            @click="deleteValueRecord(valueRecord.id)"
            href="#"
            class="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
            data-bs-toggle="tooltip"
            data-bs-original-title="Delete"
            title="Delete"
          >
            <KTIcon icon-name="trash" icon-class="fs-3" />
          </a>
          <!--end::Delete-->
        </template>
      </Datatable>
    </div>
  </div>

  <AddValueRecordModal :tableData="tableData"></AddValueRecordModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import AddValueRecordModal from "./AddValueRecordModal.vue";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import type { IValueRecord } from "@/core/data/valueRecords";
import { useAuthStore } from "@/stores/auth";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

const authStore = useAuthStore();

const response = await ApiService.get("/value-record");
if(response.status === 401) authStore.refreshToken();

const valueRecords = response.data.data;
const totalItems = response.data.totalElements; 

export default defineComponent({
  name: "valueRecords-listing",
  components: {
    Datatable,
    AddValueRecordModal,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Value",
        columnLabel: "value",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Validity Degree",
        columnLabel: "validityDegree",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Validity Category",
        columnLabel: "validityCategory",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Lot Reference",
        columnLabel: "lotReference",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Organization",
        columnLabel: "organization",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName:"Metric",
        columnLabel: "metric",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Production Activity",
        columnLabel: "productionActivity",
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
    const tableData = ref<Array<IValueRecord>>(valueRecords? valueRecords : []);
    const valueRecord = ref<Object>([]);
    const initValueRecords = ref<Array<IValueRecord>>([]);
    let current_page = ref<number>(0);
    let items_per_page = ref<number>(10);

    onMounted(() => {
      initValueRecords.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const getValueRecords = async (current_page_param: number, items_per_page_param: number) => {
      if(items_per_page.value !== items_per_page_param){
        const response = await ApiService.get("value-record?page=0&items_per_page=" + items_per_page_param);
        tableData.value = response.data.data;
      }else{
        const response = await ApiService.get("value-record?page=" + current_page_param + "&items_per_page=" + items_per_page_param);
        tableData.value = response.data.data;
      }
    };

    const currentPage = (page: any) => {
      page = page - 1;
      getValueRecords(page, items_per_page.value);
      current_page.value = page;
    };

    const itemsPerPage = (items: any) => {
      getValueRecords(current_page.value, items);
      items_per_page.value = items;
    };

    const editValueRecord = (valueRecordI: IValueRecord) => {
      valueRecord.value = valueRecordI;
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
                ApiService.delete(`/value-record/${item}`);
                tableData.value = tableData.value.filter((valueRecord) => valueRecord.id !== item.toString());
              });
              selectedIds.value.length = 0;
            }else{
              ApiService.delete(`/value-record/${id}`);
              tableData.value = tableData.value.filter((valueRecord) => valueRecord.id !== id.toString());
            }
            Swal.fire("Deleted!", "Value record have been deleted.", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelled", "Your value records are safe :)", "error");
          }
        });
    }

    const deleteFewValueRecords = () => {
      deleteModalConfirmation();
    };

    const deleteValueRecord = (id: number) => {
      deleteModalConfirmation(id);
    };

    // const search = ref<string>("");
    // const searchItems = () => {
    //   tableData.value.splice(0, tableData.value.length, ...initValueRecords.value);
    //   if (search.value !== "") {
    //     let results: Array<IValueRecord> = [];
    //     for (let j = 0; j < tableData.value.length; j++) {
    //       if (searchingFunc(tableData.value[j], search.value)) {
    //         results.push(tableData.value[j]);
    //       }
    //     }
    //     tableData.value.splice(0, tableData.value.length, ...results);
    //   }
    //   MenuComponent.reinitialization();
    // };

    // const searchingFunc = (obj: any, value: string): boolean => {
    //   for (let key in obj) {
    //     if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
    //       if (obj[key].indexOf(value) != -1) {
    //         return true;
    //       }
    //     }
    //   }
    //   return false;
    // };

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
      deleteValueRecord,
      selectedIds,
      deleteFewValueRecords,
      sort,
      onItemSelect,
      currentPage,
      itemsPerPage,
      totalItems,
      editValueRecord,
      valueRecord,
    };
  },
});
</script>