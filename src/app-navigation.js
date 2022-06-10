export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Dashboards',
    icon: 'chart',
    items: [
      {
        text: 'Otel Dashboard',
        icon: 'fas fa-hotel',
        path: '/dash/hotel/home'
      },
      {
        text: 'Ges Dashboard',
        icon: 'fas fa-solar-panel',
        path: '/tasks'
      }
    ]
  },
  {
    text: 'Muhasebe',
    icon: 'decreaseindent',
    items: [
      {
        text: 'P&L Raporu',
        path: '/counting/pl-report'
      },
      {
        text: 'Fatura Paneli',
        path: '/counting/invoice-panel'
      },
      
      
    ]
  },
  {
    text: 'Finans',
    icon: 'money',
    items: [
      {
        text: 'Nakit Akış',
        path: '/finance/cash-flow'
      },
     
      {
        text: 'Yaşlandırma Rap.',
        path: '/finance/aging-report'
      },
      {
        text: 'Bütçe',
        path: '/finance/budget'
      },
      {
        text: 'Bütçe Kurları',
        path: '/finance/budget/exchage-rates',
        icon: 'fab fa-exchange'
      },
      {
        text: 'Parametreler',
        icon: 'key',
        items:[
          {
            text: 'Rapor Kod İşlem',
            path: '/finance/param/report-code'
          },
        ]
      }
    ]
  },{
    text: 'Otel',
    icon: 'fas fa-hotel',
    items: [
      {
        text: 'Acenta Rapor',
        icon: 'fas fa-plane',
        items: [
          {
            text: 'Gelir (Satış Bazlı)',
            path: '/hotel/agent-report/sale'
          },
          {
            text: 'Gelir (Konaklama Bazlı)',
            path: '/hotel/agent-report/income'
          },{
            text: 'Acenta Grafik',
            path: '/hotel/dashboard/agency-tree'
          }
        ]
      },{
        text: 'Konaklama',
        icon: 'fas fa-bed',
        items:[
          {
            text: 'Günlük Çizgisel Gr.',
            path: '/hotel/dashboard/daily-line-chart'
          }
        ]
      }
    ]
  },{
    text: 'İnşaat',
    icon: 'fas fa-hammer',
    items: [
      {
        text: 'Gider Raporu',
        icon: 'fas fa-file-invoice-dollar',
        path: '/cons/report/activity-report'
        
      }
    ]
  },{
    text: 'Admin Panel',
    icon: 'fas fa-users-cog',
    items: [
      {
        text: 'Kullanıcı Panel',
        icon: 'fas fa-user-lock',
        path: '/admin/user-panel'
      },
      {
        text: 'Yetki Grup Panel',
        icon: 'fas fa-user-shield',
        path: '/admin/auth-group-panel'
      }
    ]
  }
  ];
