<template>
  <!--begin::Row-->
  <div class="row g-5 g-xl-8">
    <div class="col-xl-3">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        icon-name="parcel"
        color="dark"
        icon-color="white"
        :title="totalValueRecords"
        :description="translate('lots')"
      ></StatisticsWidget5>
    </div>

    <div class="col-xl-3">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        icon-name="chart-line"
        color="info"
        icon-color="white"
        :title="totalValueRecords"
        :description="translate('valueRecords')"
      ></StatisticsWidget5>
    </div>
      <div v-if="User.username === 'admin'" class="col-xl-3">
        <StatisticsWidget5
          widget-classes="card-xl-stretch mb-xl-8"
          icon-name="cube-2"
          color="success"
          icon-color="white"
          :title="totalMetrics"
          :description="translate('metrics')"
        ></StatisticsWidget5>
      </div>

      <div v-if="User.username === 'admin'" class="col-xl-3">
        <StatisticsWidget5
          widget-classes="card-xl-stretch mb-xl-8"
          icon-name="people"
          color="primary"
          icon-color="white"
          :title="totalOrganizations"
          :description="translate('organizations')"
        ></StatisticsWidget5>
      </div>
  </div>
  <!--end::Row-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import StatisticsWidget5 from "@/components/widgets/statsistics/Widget5.vue";
import ApiService from "@/core/services/ApiService";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();
const User = store.user;

const responseMetrics = await ApiService.get("/metrics");
const totalMetrics = responseMetrics.data.page.totalElements; 

const responseProductionActivities = await ApiService.get("/productionActivities");
const totalProductionActivities = responseProductionActivities.data.page.totalElements; 

const totalOrganizations = ref("");

if(User.username === "admin"){
  const responseOrganizations = await ApiService.get("/organizations");
  totalOrganizations.value  = responseOrganizations.data.page.totalElements; 
}

const responseValueRecords = await ApiService.get("/valueRecords");
const totalValueRecords = responseValueRecords.data.page.totalElements; 

export default defineComponent({
  name: "widgets-statistics",
  components: {
    StatisticsWidget5,
  },
  setup() {
    const { t, te } = useI18n();

    const translate = (text: string) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    return {
      getAssetPath,
      totalMetrics,
      totalProductionActivities,
      totalOrganizations,
      totalValueRecords,
      translate,
      User,
    };
  },
});
</script>
