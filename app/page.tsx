'use client';

import {useState} from "react";

// Component imports
import HeaderComponent from "@/components/Header";
import ModalComponent from "@/components/Modal";
import ButtonsComponent from "@/components/Buttons";
import LeaderboardComponent from "@/components/Leaderboards";

export default function Home() {
    // State management
    const [loading, setLoading] = useState(false);
    const [loadText, setLoadText] = useState('Generating leaderboard...');
    const [modalType, setModalType] = useState('loading');
    const [leaders, setLeaders] = useState<any[]>([]);

  return (
      <div>
          {
              (loading) && <ModalComponent
                  setModalType={ setModalType }
                  modalType={ modalType }
                  setLoadText={ setLoadText }
                  modalText={ loadText }
                  loading={ loading }
                  setLoading={ setLoading }
                  leaders={ leaders }
                  setLeaders={ setLeaders }
              ></ModalComponent>
          }
          <HeaderComponent></HeaderComponent>
          <div className={ 'px-[20rem] py-2' }>
              <ButtonsComponent
                  modalType={ modalType }
                  setModalType={ setModalType }
                  loading={ loading }
                  setLoading={ setLoading }
              ></ButtonsComponent>
              <LeaderboardComponent
                  leaders={ leaders }
              ></LeaderboardComponent>
          </div>
      </div>
  )
}
