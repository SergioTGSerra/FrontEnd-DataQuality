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
            placeholder="Search Lots"
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
          data-kt-lot-table-toolbar="base"
        >
          <!--begin::Export-->
          <!-- <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_lots_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button> -->
          <!--end::Export-->
          <!--begin::Add lot-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_lot"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Lot
          </button>
          <!--end::Add lot-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-lot-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewLots()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-lot-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-lot-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-lot-table-select="delete_selected"
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
        <template v-slot:reference="{ row: lot }">
          {{ lot.reference }}
        </template>
        <template v-slot:producedQuantity="{ row: lot }">
          {{ lot.producedQuantity }}
        </template>
        <template v-slot:productionActivity="{ row: lot }">
          {{ lot.productionActivityName }}
        </template>
        <template v-slot:actions="{ row: lot }"> 
          <!--begin::View-->
          <a 
            href=""
            class="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
            title="View"
          >
            <router-link
              :to="`/lots/${lot.id}`"
            >
              <KTIcon icon-name="eye" icon-class="fs-3" />
            </router-link>
          </a> 
          <!--end::View-->
          <!--begin::Edit-->
          <a
              @click="editLot(lot)"
              href="#"
              class="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_edit_lot"
              title="Edit"
            >
              <span
                data-bs-toggle="tooltip"
                data-bs-trigger="hover"
                data-bs-original-title="Edit"
              >
                <KTIcon icon-name="pencil" icon-class="fs-3" />
              </span>
          </a>
          <!--end::Edit-->
          <!--begin::Delete-->
          <a
            @click="deleteLot(lot.id)"
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

  <!-- <ExportLotModal></ExportLotModal> -->
  <AddLotModal :tableData="tableData"></AddLotModal>
  <EditLotModal :lot="lot" :tableData="tableData"></EditLotModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
// import ExportLotModal from "@/components/modals/forms/ExportLotModal.vue";
import AddLotModal from "./AddLotModal.vue";
import EditLotModal from "./EditLotModal.vue";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth";
//import { ILot } from "@/core/data/lots";

const authStore = useAuthStore();
const response = await ApiService.get("/lots");

if(response.status === 401) authStore.refreshToken();

const lots = response.data._embedded.lots;
const totalItems = response.data.page.totalElements; 

const getProductionActivityById = async (id: string) => {
  try {
    const response = await ApiService.get(`/lots`, id + `/productionActivity`);

    return response.data;
  } catch (error) {
    console.error(`Erro ao carregar o nome do lote: ${error}`);
    return null;
  }
};

const ILots: any = await Promise.all(lots.map(async (lot: any) => {
  const id = lot._links.self.href.split('/').pop() as string;
  const productionActivityId = lot._links.productionActivity.href.split('/')[5];
  const productionActivity = await getProductionActivityById(productionActivityId);
  return {
    id,
    reference: lot.reference,
    producedQuantity: lot.producedQuantity,
    productionActivityId : productionActivityId,
    productionActivityName: productionActivity.name ? productionActivity.name : "",
  };
}));

export default defineComponent({
  name: "lots-listing",
  components: {
    Datatable,
    AddLotModal,
    EditLotModal,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Reference",
        columnLabel: "reference",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Produced Quantity",
        columnLabel: "producedQuantity",
        sortEnabled: true,
        columnWidth: 230,
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
    const tableData = ref<Array<any>>(ILots? ILots : []);
    const productionActivity = ref<Object>([]);
    const lot = ref<Object>([]);
    const initLots = ref<Array<any>>([]);
    let current_page = ref<number>(0);
    let items_per_page = ref<number>(10);

    onMounted(() => {
      initLots.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const getLots = async (current_page_param: number, items_per_page_param: number) => {
      if(items_per_page.value !== items_per_page_param){
        const response = await ApiService.get("lots?page=0&size=" + items_per_page_param);
        tableData.value = response.data._embedded.lots;
      }else{
        const response = await ApiService.get("lots?page=" + current_page_param + "&size=" + items_per_page_param);
        tableData.value = response.data._embedded.lots;
      }
    };

    const currentPage = (page: any) => {
      page = page - 1;
      getLots(page, items_per_page.value);
      current_page.value = page;
    };

    const itemsPerPage = (items: any) => {
      getLots(current_page.value, items);
      items_per_page.value = items;
    };

    const editLot = (lotI: any) => {
      lot.value = lotI;
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
                ApiService.delete(`/lots/${item}`);
                tableData.value = tableData.value.filter((lot) => lot.id !== item.toString());
              });
              selectedIds.value.length = 0;
            }else{
              ApiService.delete(`/lots/${id}`);
              tableData.value = tableData.value.filter((lot) => lot.id !== id.toString());
            }
            Swal.fire("Deleted!", "Lot have been deleted.", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelled", "Your lots are safe :)", "error");
          }
        });
    }

    const deleteFewLots = () => {
      deleteModalConfirmation();
    };

    const deleteLot = (id: number) => {
      deleteModalConfirmation(id);
    };

    // const search = ref<string>("");
    // const searchItems = () => {
    //   tableData.value.splice(0, tableData.value.length, ...initLots.value);
    //   if (search.value !== "") {
    //     let results: Array<ILot> = [];
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
      deleteLot,
      selectedIds,
      deleteFewLots,
      sort,
      onItemSelect,
      editLot,
      lot,
      currentPage,
      itemsPerPage,
      totalItems,
      initLots
    };
  },
});
</script>