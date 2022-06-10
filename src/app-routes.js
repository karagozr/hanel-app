import { withNavigationWatcher } from './contexts';
import 
{ 
  HomePage,                 TasksPage,              ProfilePage,            TestViewPage,             InvoiceViewer,
  CashFlow,                 PlReport,               InvoicePanel,           HotelDashboardDailyLine,  HotelDashboardAgent,
  HotelIncomeAgentReport,   HotelSaleAgentReport,   HotelDashboardHome,     ReportCode,               AgingReport,
  UserPanel,                AuthGroupPanel,         ConsActivityReport,     BudgetList,               BudgetReportEdit,
  BudgetExchangeRate,       BudgetReport       
} from './pages';

import 
{ 
  InvoceList    
} from './pages';

const routes = [

  {
    incontent:true,
    path: '/invoice-list',
    component: InvoceList
  },

  {
    incontent:true,
    path: '/tasks',
    component: TasksPage
  },
  {
    incontent:true,
    path: '/profile',
    component: ProfilePage
  },
  {
    incontent:true,
    path: '/home',
    component: HomePage
  }, 
  {
    incontent:true,
    path: '/test-view',
    component: TestViewPage
  },
  {
    incontent:true,
    path: '/counting/invoice-panel',
    component: InvoicePanel
  },
  {
    incontent:false,
    path: '/counting/invoice/view/:ett/:inoviceNo',
    component: InvoiceViewer
  },
  {
    incontent:true,
    path: '/finance/cash-flow',
    component: CashFlow
  },
  {
    incontent:true,
    path: '/counting/pl-report',
    component: PlReport
  },
  {
    incontent:true,
    path: '/finance/aging-report',
    component: AgingReport
  },
  {
    incontent:true,
    path: '/finance/budget',
    component: BudgetList
  },
  {
    incontent:false,
    path: '/finance/budget/report-edit/:year/:projectCode',
    component: BudgetReportEdit
  },
  {
    incontent:false,
    path: '/finance/budget/report/:year',
    component: BudgetReport
  },
  {
    incontent:false,
    path: '/finance/budget/exchage-rates',
    component: BudgetExchangeRate
  },
  {
    incontent:true,
    path: '/finance/param/report-code',
    component: ReportCode
  },
  {
    incontent:true,
    path: '/hotel/dashboard/daily-line-chart',
    component: HotelDashboardDailyLine
  },
  {
    incontent:true,
    path: '/hotel/dashboard/agency-tree',
    component: HotelDashboardAgent
  },
  {
    incontent:true,
    path: '/hotel/agent-report/sale',
    component: HotelSaleAgentReport
  },
  {
    incontent:true,
    path: '/hotel/agent-report/income',
    component: HotelIncomeAgentReport
  },
  {
    incontent:true,
    path: '/dash/hotel/home',
    component: HotelDashboardHome
  },
  {
    incontent:true,
    path: '/cons/report/activity-report',
    component: ConsActivityReport
  },
  {
    incontent:true,
    path: '/admin/user-panel',
    component: UserPanel
  },
  {
    incontent:true,
    path: '/admin/auth-group-panel',
    component: AuthGroupPanel
  }
];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
