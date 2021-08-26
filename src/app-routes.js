import { withNavigationWatcher } from './contexts';
import { HomePage, TasksPage, ProfilePage, TestViewPage,InvoiceViewer,CashFlow ,InvoicePanel,HotelDashboard,HotelDashboardAgent} from './pages';

const routes = [
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
    path: '/invoice-panel',
    component: InvoicePanel
  },
  {
    incontent:false,
    path: '/invoice/view/:ett/:inoviceNo',
    component: InvoiceViewer
  },
  {
    incontent:true,
    path: '/cash-flow',
    component: CashFlow
  },
  {
    incontent:true,
    path: '/dashboard-hotel-daily-flow',
    component: HotelDashboard
  },
  {
    incontent:true,
    path: '/dashboard-hotel-agent-report',
    component: HotelDashboardAgent
  }
];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
