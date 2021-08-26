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
        items: [
          {
            text: 'Oda Satış',
            path: '/dashboard-hotel-daily-flow'
          },{
            text: 'Acenta Grafik',
            path: '/dashboard-hotel-agent-report'
          }
        ]
      },
      {
        text: 'Ges Dashboard',
        path: '/tasks'
      }
    ]
  },
  {
    text: 'Muhasebe',
    icon: 'decreaseindent',
    items: [
      {
        text: 'Fatura Paneli',
        path: '/invoice-panel'
      }
      
    ]
  },
  {
    text: 'Finans',
    icon: 'money',
    items: [
      {
        text: 'Nakit Akış',
        path: '/cash-flow'
      }
      
    ]
  }
  ];
